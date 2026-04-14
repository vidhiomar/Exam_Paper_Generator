from groq import Groq
import os
import re
import logging
from concurrent.futures import ThreadPoolExecutor
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
DEFAULT_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")


class AIService:

    @staticmethod
    def get_model_name() -> str:
        return DEFAULT_MODEL

    @staticmethod
    def get_section_marks(section: dict) -> int:
        marks = [
            question.get("marks")
            for question in section.get("questions", [])
            if isinstance(question.get("marks"), int)
        ]

        if marks:
            return max(set(marks), key=marks.count)

        return 2

    @staticmethod
    def build_reference_block(questions: list[dict], limit: int = 6) -> str:
        lines = []

        for index, question in enumerate(questions[:limit], start=1):
            text = re.sub(r"\s+", " ", question.get("text", "")).strip()

            if not text:
                continue

            marks = question.get("marks")
            marks_text = f" [{marks} marks]" if isinstance(marks, int) else ""
            lines.append(f"{index}. {text}{marks_text}")

        return "\n".join(lines) if lines else "No reference questions available."

    @staticmethod
    def build_prompt(section: dict, blueprint: dict) -> str:
        count = section.get("question_count", 5)
        marks = AIService.get_section_marks(section)
        section_name = section.get("section", "A")
        section_references = AIService.build_reference_block(section.get("questions", []))

        all_questions = []
        for blueprint_section in blueprint.get("sections", []):
            all_questions.extend(blueprint_section.get("questions", []))

        paper_references = AIService.build_reference_block(all_questions, limit=10)

        return f"""
You are an expert exam paper setter.

Generate {count} new questions for Section {section_name}.
Each generated question should be worth about {marks} marks.

The generated questions must stay in the SAME academic subject and SAME syllabus area
as the uploaded paper. Use the uploaded paper as the source of truth for topic,
terminology, difficulty, and style.

Reference questions from the full uploaded paper:
{paper_references}

Reference questions specifically from Section {section_name}:
{section_references}

Rules:
- Academic tone
- No repetition
- Stay closely related to the concepts in the reference questions
- Do not switch to a different subject, era, discipline, or domain
- Do not copy the reference questions verbatim; create fresh but related ones
- Do not include section titles, headings, or extra commentary
- Proper numbering only (1, 2, 3...)
- Do not include answers

Output format:
1. Question
2. Question
3. Question
"""

    @staticmethod
    def format_questions(text: str):
        text = re.sub(r"Section\s+[A-Z][^\n]*", "", text, flags=re.IGNORECASE)
        parts = re.split(r'\n?\s*\d+[\.\)]\s+', text)

        questions = []

        for part in parts:
            part = part.strip()

            if not part:
                continue

            part = re.sub(r'\s+', ' ', part)

            if part.lower().startswith("here are"):
                continue

            if re.fullmatch(r"\(?\d+\s*marks?\)?", part, flags=re.IGNORECASE):
                continue

            if len(part) < 12:
                continue

            questions.append(part)

        return questions

    @staticmethod
    def generate_for_section(section: dict, blueprint: dict):
        try:
            prompt = AIService.build_prompt(section, blueprint)

            response = client.chat.completions.create(
                model=AIService.get_model_name(),
                temperature=0.35,
                max_tokens=800,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You generate exam questions only from the subject context given by the user. "
                            "Never invent a different domain or unrelated syllabus."
                        ),
                    },
                    {"role": "user", "content": prompt}
                ]
            )

            raw_output = response.choices[0].message.content
            formatted_questions = AIService.format_questions(raw_output)

            return {
                "section": section["section"],
                "questions": formatted_questions
            }

        except Exception as e:
            logger.error(
                f"Error generating questions for section {section.get('section')} "
                f"using model {AIService.get_model_name()}: {e}"
            )

            error_message = str(e)

            if "model_decommissioned" in error_message or "no longer supported" in error_message:
                error_message = (
                    f"The configured Groq model '{AIService.get_model_name()}' is no longer available. "
                    "Update GROQ_MODEL in server/.env to a supported Groq model."
                )

            return {
                "section": section.get("section"),
                "questions": [],
                "error": error_message
            }

    @staticmethod
    def generate_questions(blueprint: dict):
        sections = blueprint.get("sections", [])

        if not sections:
            return {"generated_paper": []}

        with ThreadPoolExecutor(max_workers=3) as executor:
            results = list(
                executor.map(
                    AIService.generate_for_section,
                    sections,
                    [blueprint] * len(sections),
                )
            )

        return {
            "generated_paper": results
        }

import re
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)


class BlueprintService:

    SECTION_PATTERN = re.compile(r'SECTION[\s:\-]+([A-Z]+)', re.IGNORECASE)

    QUESTION_PATTERN = re.compile(r'^(?:Q?\d+[\.\)]|\(\d+\)|\d+\s*[-:])',re.IGNORECASE
    )

    SUBQUESTION_PATTERN = re.compile(r'^[a-zA-Z][\)\.]',re.IGNORECASE)

    MARKS_PATTERN = re.compile(r'[\(\[]?(\d+)\s*(?:marks?)?[\)\]]?|marks?\s*[:\-]?\s*(\d+)',re.IGNORECASE
    )

    @staticmethod
    def extract_blueprint(text: str) -> Dict:

        sections: List[Dict] = []

        current_section = None
        current_question = None

        lines = re.split(r'\n|(?=\d+\))', text)

        for line in lines:
            line = line.strip()

            if not line:
                continue

            # SECTION DETECTION

            section_match = BlueprintService.SECTION_PATTERN.search(line)
            
            if section_match:
                if current_section:
                    sections.append(current_section)

                current_section = {
                    "section": section_match.group(1).upper(),
                    "questions": [],
                    "question_count": 0
                }

                current_question = None
                continue

            # QUESTION DETECTION
            if current_section:
                question_match = BlueprintService.QUESTION_PATTERN.match(line)

                if question_match:
                    marks = BlueprintService.extract_marks(line)

                    current_question = {
                        "text": line,
                        "marks": marks,
                        "subquestions": []
                    }

                    current_section["questions"].append(current_question)
                    current_section["question_count"] += 1
                    continue

            # SUB-QUESTION DETECTION
            if current_question:
                sub_match = BlueprintService.SUBQUESTION_PATTERN.match(line)

                if sub_match:
                    current_question["subquestions"].append(line)
                    continue

            # CONTINUATION LINES
            if current_question:
                # Append broken lines to previous question
                current_question["text"] += " " + line

        # Append last section
        if current_section:
            sections.append(current_section)

        logger.info(f"Extracted {len(sections)} sections")

        return {
            "sections": sections
        }

    @staticmethod
    def extract_marks(line: str):

        match = BlueprintService.MARKS_PATTERN.search(line)

        if match:
            # match.group(1) OR group(2)
            return int(match.group(1) or match.group(2))

        return None
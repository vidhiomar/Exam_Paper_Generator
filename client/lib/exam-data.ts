export interface BlueprintQuestion {
  text: string;
  marks: number | null;
  subquestions: string[];
}

export interface BlueprintSection {
  section: string;
  questions: BlueprintQuestion[];
  question_count: number;
}

export interface BlueprintData {
  sections: BlueprintSection[];
}

export interface GeneratedPaperSection {
  section: string;
  questions: string[];
  error?: string;
}

export interface InsightData {
  totalMarks: number;
  totalQuestions: number;
  difficulty: string;
  difficultyBreakdown: {
    easy: number;
    medium: number;
    hard: number;
  };
  avgMarksPerQuestion: number;
  estimatedTime: string;
  coverage: number;
}

export interface BlueprintTableRow {
  id: string;
  section: string;
  question: string;
  subquestions: number;
  marks: number;
  bloomsLevel: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface PieDatum {
  name: string;
  value: number;
  color: string;
}

export interface BarDatum {
  topic: string;
  frequency: number;
  marks: number;
}

const PIE_COLORS = ["#4F46E5", "#2563EB", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];

export function getStoredBlueprint(): BlueprintData | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem("blueprint");

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as BlueprintData;
    return Array.isArray(parsed?.sections) ? parsed : null;
  } catch {
    return null;
  }
}

export function getStoredGeneratedPaper(): GeneratedPaperSection[] | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem("generated_paper");

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as GeneratedPaperSection[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function normalizeMarks(marks: number | null | undefined) {
  return typeof marks === "number" && Number.isFinite(marks) ? marks : 0;
}

export function getDifficultyFromMarks(marks: number): "Easy" | "Medium" | "Hard" {
  if (marks <= 2) {
    return "Easy";
  }

  if (marks <= 5) {
    return "Medium";
  }

  return "Hard";
}

export function getBloomsLevel(marks: number) {
  if (marks <= 2) {
    return "Remember";
  }

  if (marks <= 5) {
    return "Apply";
  }

  return "Analyze";
}

export function getBlueprintRows(blueprint: BlueprintData | null): BlueprintTableRow[] {
  if (!blueprint) {
    return [];
  }

  return blueprint.sections.flatMap((section, sectionIndex) =>
    section.questions.map((question, questionIndex) => {
      const marks = normalizeMarks(question.marks);

      return {
        id: `${section.section}-${questionIndex + 1}`,
        section: section.section,
        question: question.text,
        subquestions: question.subquestions.length,
        marks,
        bloomsLevel: getBloomsLevel(marks),
        difficulty: getDifficultyFromMarks(marks),
      };
    })
  );
}

export function getInsightData(blueprint: BlueprintData | null): InsightData {
  const rows = getBlueprintRows(blueprint);
  const totalMarks = rows.reduce((sum, row) => sum + row.marks, 0);
  const totalQuestions = rows.length;
  const easy = rows.filter((row) => row.difficulty === "Easy").length;
  const medium = rows.filter((row) => row.difficulty === "Medium").length;
  const hard = rows.filter((row) => row.difficulty === "Hard").length;
  const pct = (count: number) =>
    totalQuestions ? Math.round((count / totalQuestions) * 100) : 0;

  let difficulty = "Balanced";

  if (hard > easy && hard >= medium) {
    difficulty = "Advanced";
  } else if (easy > medium && easy > hard) {
    difficulty = "Beginner";
  }

  const estimatedMinutes = Math.max(30, totalMarks * 1.8);
  const hours = Math.floor(estimatedMinutes / 60);
  const minutes = Math.round(estimatedMinutes % 60);
  const estimatedTime =
    hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  return {
    totalMarks,
    totalQuestions,
    difficulty,
    difficultyBreakdown: {
      easy: pct(easy),
      medium: pct(medium),
      hard: pct(hard),
    },
    avgMarksPerQuestion: totalQuestions
      ? Number((totalMarks / totalQuestions).toFixed(1))
      : 0,
    estimatedTime,
    coverage: blueprint?.sections.length
      ? Math.min(100, blueprint.sections.length * 25)
      : 0,
  };
}

export function getPieData(blueprint: BlueprintData | null): PieDatum[] {
  if (!blueprint) {
    return [];
  }

  return blueprint.sections.map((section, index) => ({
    name: `Section ${section.section}`,
    value: section.questions.reduce(
      (sum, question) => sum + normalizeMarks(question.marks),
      0
    ),
    color: PIE_COLORS[index % PIE_COLORS.length],
  }));
}

export function getBarData(blueprint: BlueprintData | null): BarDatum[] {
  if (!blueprint) {
    return [];
  }

  return blueprint.sections.map((section) => ({
    topic: `Sec ${section.section}`,
    frequency: section.question_count,
    marks: section.questions.reduce(
      (sum, question) => sum + normalizeMarks(question.marks),
      0
    ),
  }));
}

export interface BlueprintRow {
  id: string;
  topic: string;
  subtopic: string;
  marks: number;
  questions: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  bloomsLevel: string;
  chapter: string;
}

export interface GeneratedQuestion {
  id: string;
  section: string;
  number: number;
  text: string;
  marks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  subparts?: { label: string; text: string; marks: number }[];
}

export const mockBlueprintData: BlueprintRow[] = [
  {
    id: '1',
    topic: 'Data Structures',
    subtopic: 'Arrays & Linked Lists',
    marks: 20,
    questions: 4,
    difficulty: 'Easy',
    bloomsLevel: 'Remember',
    chapter: 'Chapter 1-2',
  },
  {
    id: '2',
    topic: 'Algorithms',
    subtopic: 'Sorting & Searching',
    marks: 25,
    questions: 5,
    difficulty: 'Medium',
    bloomsLevel: 'Apply',
    chapter: 'Chapter 3-4',
  },
  {
    id: '3',
    topic: 'Database Systems',
    subtopic: 'SQL & Normalization',
    marks: 20,
    questions: 4,
    difficulty: 'Medium',
    bloomsLevel: 'Analyze',
    chapter: 'Chapter 5-6',
  },
  {
    id: '4',
    topic: 'Operating Systems',
    subtopic: 'Process Management',
    marks: 15,
    questions: 3,
    difficulty: 'Hard',
    bloomsLevel: 'Evaluate',
    chapter: 'Chapter 7',
  },
  {
    id: '5',
    topic: 'Computer Networks',
    subtopic: 'TCP/IP & Protocols',
    marks: 20,
    questions: 4,
    difficulty: 'Hard',
    bloomsLevel: 'Analyze',
    chapter: 'Chapter 8-9',
  },
];

export const mockInsights = {
  totalMarks: 100,
  totalQuestions: 20,
  difficulty: 'Moderate',
  difficultyBreakdown: { easy: 35, medium: 40, hard: 25 },
  avgMarksPerQuestion: 5,
  estimatedTime: '3 hours',
  coverage: 92,
};

export const mockPieData = [
  { name: 'Data Structures', value: 20, color: '#4F46E5' },
  { name: 'Algorithms', value: 25, color: '#2563EB' },
  { name: 'Database Systems', value: 20, color: '#06B6D4' },
  { name: 'Operating Systems', value: 15, color: '#8B5CF6' },
  { name: 'Computer Networks', value: 20, color: '#10B981' },
];

export const mockBarData = [
  { topic: 'DS', frequency: 4, marks: 20 },
  { topic: 'Algo', frequency: 5, marks: 25 },
  { topic: 'DBMS', frequency: 4, marks: 20 },
  { topic: 'OS', frequency: 3, marks: 15 },
  { topic: 'Networks', frequency: 4, marks: 20 },
];

export const mockGeneratedPaper: GeneratedQuestion[] = [
  // Section A - Short Answer (Easy)
  {
    id: 'q1',
    section: 'A',
    number: 1,
    text: 'Define the term "data structure" and explain its significance in computer science.',
    marks: 2,
    difficulty: 'Easy',
    topic: 'Data Structures',
  },
  {
    id: 'q2',
    section: 'A',
    number: 2,
    text: 'What is the difference between a stack and a queue? Give one real-world example of each.',
    marks: 2,
    difficulty: 'Easy',
    topic: 'Data Structures',
  },
  {
    id: 'q3',
    section: 'A',
    number: 3,
    text: 'State the time complexity of Binary Search. Under what conditions can it be applied?',
    marks: 2,
    difficulty: 'Easy',
    topic: 'Algorithms',
  },
  {
    id: 'q4',
    section: 'A',
    number: 4,
    text: 'Define a primary key. How does it differ from a unique key in SQL?',
    marks: 2,
    difficulty: 'Easy',
    topic: 'Database Systems',
  },
  {
    id: 'q5',
    section: 'A',
    number: 5,
    text: 'What is a process? Distinguish between a process and a thread.',
    marks: 2,
    difficulty: 'Easy',
    topic: 'Operating Systems',
  },

  // Section B - Medium (Apply/Analyze)
  {
    id: 'q6',
    section: 'B',
    number: 6,
    text: 'Trace the execution of Merge Sort on the array [38, 27, 43, 3, 9, 82, 10]. Show all intermediate steps and calculate total comparisons made.',
    marks: 5,
    difficulty: 'Medium',
    topic: 'Algorithms',
  },
  {
    id: 'q7',
    section: 'B',
    number: 7,
    text: 'Consider the following relation: Student(Roll, Name, DeptID, DeptName, HodName). Identify all functional dependencies and normalize the relation to 3NF. Show each step.',
    marks: 5,
    difficulty: 'Medium',
    topic: 'Database Systems',
  },
  {
    id: 'q8',
    section: 'B',
    number: 8,
    text: 'Write an SQL query to find the second-highest salary from an Employee table. Extend your solution to find the nth highest salary using a parameterized approach.',
    marks: 5,
    difficulty: 'Medium',
    topic: 'Database Systems',
  },
  {
    id: 'q9',
    section: 'B',
    number: 9,
    text: 'Implement a singly linked list in pseudo-code or C with the following operations:',
    marks: 5,
    difficulty: 'Medium',
    topic: 'Data Structures',
    subparts: [
      { label: '(a)', text: 'Insert at beginning and end', marks: 2 },
      { label: '(b)', text: 'Delete a node by value', marks: 2 },
      { label: '(c)', text: 'Reverse the linked list in-place', marks: 1 },
    ],
  },

  // Section C - Long Answer (Hard)
  {
    id: 'q10',
    section: 'C',
    number: 10,
    text: 'Explain the Producer-Consumer problem in Operating Systems. Provide a solution using semaphores and discuss how it prevents race conditions, deadlock, and starvation.',
    marks: 10,
    difficulty: 'Hard',
    topic: 'Operating Systems',
    subparts: [
      { label: '(a)', text: 'Problem formulation and shared resources', marks: 3 },
      { label: '(b)', text: 'Semaphore-based solution with pseudocode', marks: 4 },
      { label: '(c)', text: 'Analysis of deadlock prevention in your solution', marks: 3 },
    ],
  },
  {
    id: 'q11',
    section: 'C',
    number: 11,
    text: 'Describe the TCP three-way handshake process in detail. How does TCP ensure reliable data transfer? Compare TCP and UDP across five parameters with appropriate use-cases.',
    marks: 10,
    difficulty: 'Hard',
    topic: 'Computer Networks',
    subparts: [
      { label: '(a)', text: 'Three-way handshake with state diagrams', marks: 4 },
      { label: '(b)', text: 'Reliability mechanisms (ACK, flow control, congestion control)', marks: 3 },
      { label: '(c)', text: 'TCP vs UDP comparative table', marks: 3 },
    ],
  },
];

export const paperMeta = {
  institution: 'State University of Technology',
  department: 'Department of Computer Science & Engineering',
  exam: 'End Semester Examination — B.Tech CSE',
  subject: 'Computer Science Fundamentals',
  subjectCode: 'CSE-301',
  semester: '5th Semester',
  maxMarks: 100,
  duration: '3 Hours',
  date: 'April 2026',
  instructions: [
    'All questions are compulsory.',
    'Read all instructions carefully before answering.',
    'Section A carries 2 marks each, Section B carries 5 marks each, and Section C carries 10 marks each.',
    'Write answers in the spaces provided. Use of mobile phones is strictly prohibited.',
    'Attempt all sub-parts of a question together.',
  ],
};

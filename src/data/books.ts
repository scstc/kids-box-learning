export type LearningBook = { number: number; status: "available" | "coming-soon" };

// Each book will own its course and progress keys when its content is added.
export const learningBooks: LearningBook[] = [
  { number: 1, status: "available" },
  { number: 2, status: "coming-soon" },
  { number: 3, status: "coming-soon" },
  { number: 4, status: "coming-soon" },
  { number: 5, status: "coming-soon" },
  { number: 6, status: "coming-soon" },
];

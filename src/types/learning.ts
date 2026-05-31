export type LearningItemKind = "materi" | "kuis";

export interface Instructor {
  name: string;
  email: string;
}

export interface Participant {
  id: number;
  name: string;
  email: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  mediaUrl?: string;
  options: string[];
  correct: number;
}

export interface LearningItem {
  id: number;
  kind: LearningItemKind;
  title: string;
  description: string;
  duration: string;
  estimatedMinutes: number;
  isCompleted: boolean;
  thumbnailUrl?: string;
  objectives?: string[];
  tools?: string[];
  questions?: QuizQuestion[];
  timeLimitMinutes?: number;
}

export interface LearningModule {
  id: number;
  title: string;
  description: string;
  banner: string;
  thumbnail: string;
  progress: number;
  estimatedTime: string;
  instructor: Instructor;
  objectives: string[];
  participants: Participant[];
  items: LearningItem[];
}
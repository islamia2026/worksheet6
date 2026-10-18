export type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'fill_blank'
  | 'terminology'
  | 'classification';

export type IslamicField =
  | 'العقيدة'
  | 'الحديث الشريف'
  | 'الفقه'
  | 'السيرة النبوية'
  | 'التهذيب'
  | 'الثقافة الإسلامية';

export interface Question {
  id: string;
  unitId: number;
  lessonId: string;
  questionNumber: number; // 1 to 5
  type: QuestionType;
  prompt: string;
  options?: string[]; // for multiple choice
  correctAnswer: string; // The canonical answer from the ministry doc
  explanation?: string; // Additional context from doc
  field: IslamicField;
  fillOptions?: string[]; // Helpful word banks for fill_blank questions
}

export interface Lesson {
  id: string; // e.g., 'u1_l1'
  unitId: number;
  lessonNumber: number; // 1 to 4
  title: string;
  field: IslamicField;
  questions: Question[];
  icon: string;
}

export interface Unit {
  id: number; // 1 to 4
  title: string;
  subtitle: string;
  description: string;
  color: string;
  accentColor: string;
  icon: string;
  lessons: Lesson[];
}

export interface LessonAnswerRecord {
  userAnswer: string;
  isCorrect: boolean;
  questionNumber?: number;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  score: number; // 0 to 5
  maxScore: number; // 5
  stars: number; // 0 to 3
  attemptsCount: number;
  lastAttemptAt: string;
  answers: Record<number, LessonAnswerRecord>;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlockedAt?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  grade: string;
  section: string;
  createdAt: string;
  lastActiveAt: string;
  totalPoints: number;
  completedLessons: string[]; // lesson ids
  completedUnits: number[]; // unit ids
  lessonProgress: Record<string, LessonProgress>;
  badges: string[]; // badge ids
}

export interface AppSettings {
  soundEnabled: boolean;
}

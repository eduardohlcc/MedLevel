export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type QuestionStatus = 'DRAFT' | 'REVIEWED' | 'PUBLISHED';
export type ExamMode = 'ENAMED_OFFICIAL' | 'CUSTOM';
export type ExamStatus = 'IN_PROGRESS' | 'FINISHED' | 'EXPIRED';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  targetExamDate: string | null;
  weeklyHoursGoal: number | null;
}

export interface TokensResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: UserProfile;
  tokens: TokensResponse;
}

export interface Alternative {
  id: string;
  letter: string;
  text: string;
  isCorrect?: boolean;
  explanation?: string;
}

export interface QuestionSummary {
  id: string;
  code: string;
  stem: string;
  area: string;
  topicName: string;
  difficulty: Difficulty;
  year: number;
  source: string;
  status: QuestionStatus;
  attemptsCount?: number;
}

export interface QuestionDetail extends QuestionSummary {
  disclaimer: string;
  alternatives: Alternative[];
}

export interface AttemptResult {
  id: string;
  questionId: string;
  isCorrect: boolean;
  selectedAlternativeId: string;
  correctAlternativeId: string;
  explanation: string;
  durationSeconds: number;
  inReviewDeck: boolean;
  alternativesFeedback?: {
    id: string;
    letter: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface ExamSessionDetail {
  id: string;
  mode: ExamMode;
  status: ExamStatus;
  totalQuestions: number;
  durationMinutes: number;
  startedAt: string;
  remainingSeconds: number;
  questions: {
    id: string;
    orderIndex: number;
    code: string;
    area: string;
    topicName: string;
    stem: string;
    alternatives: { id: string; letter: string; text: string }[];
  }[];
  answers: Record<string, { alternativeId: string | null; flaggedForReview: boolean }>;
}

export interface ExamReport {
  id: string;
  mode: ExamMode;
  status: ExamStatus;
  totalQuestions: number;
  correctCount: number;
  scorePercentage: number;
  totalDurationSeconds: number;
  areaBreakdown: {
    area: string;
    total: number;
    correct: number;
    percentage: number;
  }[];
  questionsReview?: {
    orderIndex: number;
    questionId: string;
    stem: string;
    code: string;
    area: string;
    topicName: string;
    selectedAlternativeId: string | null;
    isCorrect: boolean;
    alternatives: Alternative[];
  }[];
}

export interface ReviewCardItem {
  id: string;
  questionId: string;
  repetitions: number;
  interval: number;
  easeFactor: number;
  dueDate: string;
  question: QuestionDetail;
}

export interface DashboardStats {
  totalAttempts: number;
  overallAccuracy: number;
  averageTimeSeconds: number;
  completedExamsCount: number;
  activeReviewCardsCount: number;
  areaAccuracy: {
    area: string;
    accuracy: number;
    attempts: number;
  }[];
  weeklyEvolution: {
    week: string;
    accuracy: number;
    questionsDone: number;
  }[];
  weakTopics: {
    name: string;
    area: string;
    accuracy: number;
  }[];
  strongTopics: {
    name: string;
    area: string;
    accuracy: number;
  }[];
}

export interface StudyPlanResponse {
  targetExamDate: string;
  daysRemaining: number;
  weeklyHoursGoal: number;
  dailySuggestedTopics: {
    id: string;
    topicName: string;
    area: string;
    reason: string;
    recommendedQuestions: number;
  }[];
}

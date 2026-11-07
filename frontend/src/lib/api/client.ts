import {
  AuthResponse,
  DashboardStats,
  ExamReport,
  ExamSessionDetail,
  QuestionDetail,
  QuestionSummary,
  ReviewCardItem,
  StudyPlanResponse,
} from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetcher<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('medlevel_token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `Erro ${response.status}: ${response.statusText}`;
    let errorData = null;
    try {
      errorData = await response.json();
      if (errorData?.message) {
        errorMsg = Array.isArray(errorData.message)
          ? errorData.message.join(', ')
          : errorData.message;
      }
    } catch {
      // ignore
    }
    throw new ApiError(response.status, errorMsg, errorData);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  // Auth
  auth: {
    login: (body: { email: string; password: string }) =>
      fetcher<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    register: (body: any) =>
      fetcher<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    me: () => fetcher<any>('/auth/me'),
    forgotPassword: (email: string) =>
      fetcher<{ message: string }>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
    deleteAccount: () =>
      fetcher<{ message: string }>('/auth/account', {
        method: 'DELETE',
      }),
  },

  // Questions
  questions: {
    list: (params?: { area?: string; search?: string; difficulty?: string; page?: number }) => {
      const query = new URLSearchParams();
      if (params?.area && params.area !== 'all') query.set('area', params.area);
      if (params?.search) query.set('search', params.search);
      if (params?.difficulty && params.difficulty !== 'all') query.set('difficulty', params.difficulty);
      if (params?.page) query.set('page', params.page.toString());
      return fetcher<{ data: QuestionSummary[]; total: number; page: number; totalPages: number }>(
        `/questions?${query.toString()}`,
      );
    },
    getById: (id: string) => fetcher<QuestionDetail>(`/questions/${id}`),
    attempt: (id: string, body: { alternativeId: string; durationSeconds: number }) =>
      fetcher<any>(`/questions/${id}/attempt`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },

  // Exams
  exams: {
    start: (body: { mode: string; customQuestionCount?: number; selectedAreas?: string[] }) =>
      fetcher<ExamSessionDetail>('/exams', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    getById: (id: string) => fetcher<ExamSessionDetail>(`/exams/${id}`),
    saveAnswer: (
      id: string,
      body: { questionId: string; alternativeId: string; flaggedForReview?: boolean },
    ) =>
      fetcher<{ success: boolean }>(`/exams/${id}/answers`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    finish: (id: string) =>
      fetcher<ExamReport>(`/exams/${id}/finish`, {
        method: 'POST',
      }),
    getReport: (id: string) => fetcher<ExamReport>(`/exams/${id}/report`),
  },

  // Reviews SM-2
  reviews: {
    getToday: () => fetcher<ReviewCardItem[]>('/reviews/today'),
    submitGrade: (cardId: string, grade: number) =>
      fetcher<any>(`/reviews/${cardId}/grade`, {
        method: 'POST',
        body: JSON.stringify({ grade }),
      }),
  },

  // Dashboard
  dashboard: {
    getStats: () => fetcher<DashboardStats>('/dashboard/stats'),
  },

  // Study Plan
  studyPlan: {
    get: () => fetcher<StudyPlanResponse>('/study-plan'),
    update: (body: { targetExamDate: string; weeklyHoursGoal: number }) =>
      fetcher<StudyPlanResponse>('/study-plan', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },

  // Admin
  admin: {
    createQuestion: (body: any) =>
      fetcher<any>('/admin/questions', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    importQuestions: (body: any[]) =>
      fetcher<{ message: string; count: number }>('/admin/questions/import', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },
};

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URI || import.meta.env.BACKEND_URI || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};

// Exams API
export const examsAPI = {
  getAll: async () => {
    const response = await api.get('/exams');
    return response.data;
  },
  getById: async (id: string | number) => {
    const response = await api.get(`/exams/${id}`);
    return response.data;
  },
  create: async (exam: { title: string; description: string }) => {
    const response = await api.post('/exams', exam);
    return response.data;
  },
  update: async (id: string | number, exam: any) => {
    const response = await api.put(`/exams/${id}`, exam);
    return response.data;
  },
  delete: async (id: string | number) => {
    const response = await api.delete(`/exams/${id}`);
    return response.data;
  },
  addQuestions: async (id: string | number, questionIds: (string | number)[]) => {
    const response = await api.post(`/exams/${id}/questions`, { questionIds });
    return response.data;
  },
  getQuestions: async (id: string | number) => {
    const response = await api.get(`/exams/${id}/questions`);
    return response.data;
  },
};

// Questions API
export const questionsAPI = {
  getAll: async () => {
    const response = await api.get('/questions');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/questions/${id}`);
    return response.data;
  },
  create: async (question: any) => {
    const response = await api.post('/questions', question);
    return response.data;
  },
  update: async (id: string, question: any) => {
    const response = await api.put(`/questions/${id}`, question);
    return response.data;
  },
  delete: async (id: string | number) => {
    const response = await api.delete(`/questions/${id}`);
    return response.data;
  },
};

// Assignments API
export const assignmentsAPI = {
  create: async (assignment: any) => {
    const response = await api.post('/assignments', assignment);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/assignments');
    return response.data;
  },
  getMyAssignments: async () => {
    const response = await api.get('/assignments/me');
    return response.data;
  },
  getById: async (id: string | number) => {
    const response = await api.get(`/assignments/${id}`);
    return response.data;
  },
  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/assignments/${id}/status`, { status });
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
};

// Submissions API
export const submissionsAPI = {
  submit: async (assignmentId: number, answers: any[]) => {
    const response = await api.post('/submissions', {
      assignmentId,
      answers,
    });
    return response.data;
  },
  getSubmissions: async (assignmentId: number) => {
    const response = await api.get(`/submissions/${assignmentId}`);
    return response.data;
  },
};

export default api;
import apiClient from '../components/api';
import { mockUsers, mockAssignments, mockSubmissions, delay } from './mockData';

// Configuration flag to toggle mock mode
// In a real app, this would come from import.meta.env.VITE_USE_MOCK
const USE_MOCK = false; // Set to false to use real backend

// Use the shared apiClient which has auth interceptors and baseURL configured
const client = apiClient;

// Helper to simulate API responses
const mockResponse = (data) => Promise.resolve({ data });

const api = {
    // Curriculum / Assignments
    curriculum: {
        getAssignments: async (params) => {
            if (USE_MOCK) {
                await delay();
                let filtered = [...mockAssignments];
                if (params?.class_id) {
                    filtered = filtered.filter(a => a.class_id === params.class_id);
                }
                if (params?.subject_id) {
                    filtered = filtered.filter(a => a.subject_id === params.subject_id);
                }
                return mockResponse(filtered);
            }
            return client.get('/curriculum/assignments', { params });
        },
        submitAssignment: async (data) => {
            if (USE_MOCK) {
                await delay(1200);
                const newSubmission = {
                    id: Math.floor(Math.random() * 10000),
                    ...data,
                    submitted_at: new Date().toISOString(),
                    status: 'Submitted'
                };
                return mockResponse(newSubmission);
            }
            return client.post('/curriculum/submissions', data);
        }
    },

    // Users (for Admin)
    users: {
        getAll: async () => {
            if (USE_MOCK) {
                await delay();
                return mockResponse(mockUsers);
            }
            return client.get('/admin/users');
        }
    },

    // AI Features
    ai: {
        chat: (message, context = "") => client.post('/ai/chat', { message, context }),
        generateLessonPlan: (data) => client.post('/ai/generate-lesson', data),
        gradeAssignment: (data) => client.post('/ai/grade', data),
        generateStudyGuide: (data) => client.post('/ai/study-guide', data),
        predictPerformance: (data) => client.post('/ai/predict', data)
    }
};

export default api;

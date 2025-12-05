/**
 * Centralized Mock Data for the MEB School Management System.
 * This file replaces scattered mock objects and provides a consistent data source
 * for the "Frontend-Only" demonstration mode.
 */

export const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Student', status: 'Active', student_id: 'STU001' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Teacher', status: 'Active', teacher_id: 'TCH001' },
  { id: 3, name: 'Peter Jones', email: 'peter.jones@example.com', role: 'Student', status: 'Inactive', student_id: 'STU002' },
  { id: 4, name: 'Mary Williams', email: 'mary.w@example.com', role: 'Parent', status: 'Active', parent_id: 'PAR001' },
  { id: 5, name: 'David Brown', email: 'david.b@example.com', role: 'Admin', status: 'Active', admin_id: 'ADM001' },
  { id: 6, name: 'Emily Davis', email: 'emily.d@example.com', role: 'Teacher', status: 'Active', teacher_id: 'TCH002' },
];

export const mockAssignments = [
  {
    id: 101,
    title: 'Algebra Fundamentals',
    description: 'Complete exercises 1-10 on page 42. Focus on linear equations.',
    due_date: '2023-11-15',
    subject_id: 'MATH101',
    class_id: 'CLASS_A',
    status: 'Pending'
  },
  {
    id: 102,
    title: 'History Essay: The Industrial Revolution',
    description: 'Write a 500-word essay on the impact of the steam engine.',
    due_date: '2023-11-20',
    subject_id: 'HIST201',
    class_id: 'CLASS_A',
    status: 'Submitted'
  },
  {
    id: 103,
    title: 'Physics Lab Report',
    description: 'Submit your findings from the pendulum experiment.',
    due_date: '2023-11-22',
    subject_id: 'PHYS301',
    class_id: 'CLASS_B',
    status: 'Pending'
  }
];

export const mockSubmissions = [
  {
    id: 501,
    assignment_id: 102,
    student_id: 1,
    content_url: 'https://docs.google.com/document/d/example',
    submitted_at: '2023-11-18T10:30:00Z',
    grade: null,
    feedback: null
  }
];

export const mockInvoices = [
  { id: 'INV-001', student_name: 'John Doe', amount: 500.00, due_date: '2023-12-01', status: 'Unpaid' },
  { id: 'INV-002', student_name: 'Peter Jones', amount: 150.00, due_date: '2023-11-01', status: 'Paid' },
];

// Helper to simulate network delay
export const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export const TASK_STATUSES = ['todo', 'inprogress', 'needtest', 'completed', 'reopen'];

const initialState = {
  tasks: [
    {
      id: 'task-1',
      projectId: 'proj-1',
      title: 'Design Homepage UI',
      description: 'Create wireframes and final UI design for the homepage.',
      assignedEmployee: 'emp-2',
      eta: '2024-02-15',
      status: 'completed',
      referenceImages: [],
    },
    {
      id: 'task-2',
      projectId: 'proj-1',
      title: 'Implement Auth Flow',
      description: 'Build login, register, and password reset functionality.',
      assignedEmployee: 'emp-1',
      eta: '2024-03-01',
      status: 'inprogress',
      referenceImages: [],
    },
    {
      id: 'task-3',
      projectId: 'proj-1',
      title: 'Setup Payment Gateway',
      description: 'Integrate Stripe for payment processing.',
      assignedEmployee: 'emp-3',
      eta: '2024-04-01',
      status: 'todo',
      referenceImages: [],
    },
    {
      id: 'task-4',
      projectId: 'proj-2',
      title: 'API Architecture',
      description: 'Design RESTful API structure for banking operations.',
      assignedEmployee: 'emp-3',
      eta: '2024-04-15',
      status: 'needtest',
      referenceImages: [],
    },
  ],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push({ ...action.payload, id: uuidv4() });
    },
    updateTask: (state, action) => {
      const idx = state.tasks.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) state.tasks[idx] = action.payload;
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },
    moveTask: (state, action) => {
      const { taskId, newStatus } = action.payload;
      const idx = state.tasks.findIndex(t => t.id === taskId);
      if (idx !== -1) state.tasks[idx].status = newStatus;
    },
    deleteTasksByProject: (state, action) => {
      state.tasks = state.tasks.filter(t => t.projectId !== action.payload);
    },
  },
});

export const { addTask, updateTask, deleteTask, moveTask, deleteTasksByProject } = tasksSlice.actions;
export default tasksSlice.reducer;

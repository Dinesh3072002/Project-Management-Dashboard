import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  projects: [
    {
      id: 'proj-1',
      title: 'E-Commerce Platform',
      description: 'Build a full-stack e-commerce platform with payment integration and inventory management.',
      logo: null,
      startDate: '2024-01-15T09:00',
      endDate: '2024-06-30T18:00',
      assignedEmployees: ['emp-1', 'emp-2', 'emp-3'],
    },
    {
      id: 'proj-2',
      title: 'Mobile Banking App',
      description: 'Develop a secure mobile banking application with real-time transaction tracking.',
      logo: null,
      startDate: '2024-03-01T09:00',
      endDate: '2024-09-30T18:00',
      assignedEmployees: ['emp-1', 'emp-3'],
    },
  ],
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject: (state, action) => {
      state.projects.push({ ...action.payload, id: uuidv4() });
    },
    updateProject: (state, action) => {
      const idx = state.projects.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) state.projects[idx] = action.payload;
    },
    deleteProject: (state, action) => {
      state.projects = state.projects.filter(p => p.id !== action.payload);
    },
  },
});

export const { addProject, updateProject, deleteProject } = projectsSlice.actions;
export default projectsSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import employeesReducer from './slices/employeesSlice';
import projectsReducer from './slices/projectsSlice';
import tasksReducer from './slices/tasksSlice';

export const store = configureStore({
  reducer: {
    employees: employeesReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
  },
});

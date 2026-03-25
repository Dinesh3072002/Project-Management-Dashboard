import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  employees: [
    {
      id: 'emp-1',
      name: 'Arun Kumar',
      position: 'Frontend Developer',
      email: 'arun.kumar@company.com',
      profileImage: null,
    },
    {
      id: 'emp-2',
      name: 'Priya Sharma',
      position: 'UI/UX Designer',
      email: 'priya.sharma@company.com',
      profileImage: null,
    },
    {
      id: 'emp-3',
      name: 'Karthik Raj',
      position: 'Backend Developer',
      email: 'karthik.raj@company.com',
      profileImage: null,
    },
  ],
};

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    addEmployee: (state, action) => {
      state.employees.push({ ...action.payload, id: uuidv4() });
    },
    updateEmployee: (state, action) => {
      const idx = state.employees.findIndex(e => e.id === action.payload.id);
      if (idx !== -1) state.employees[idx] = action.payload;
    },
    deleteEmployee: (state, action) => {
      state.employees = state.employees.filter(e => e.id !== action.payload);
    },
  },
});

export const { addEmployee, updateEmployee, deleteEmployee } = employeesSlice.actions;
export default employeesSlice.reducer;

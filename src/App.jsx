import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import DashboardPage from './components/dashboard/DashboardPage';
import EmployeesPage from './components/employees/EmployeesPage';
import ProjectsPage from './components/projects/ProjectsPage';
import TasksPage from './components/tasks/TasksPage';

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

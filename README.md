# PM.Flow — Project Management Dashboard

A full-featured Project Management Dashboard built with React, Redux Toolkit, and dnd-kit. Includes CRUD for Employees, Projects, and Tasks, with a drag-and-drop Kanban board.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 (Functional Components + Hooks) |
| Routing | React Router DOM v6 |
| State Management | Redux Toolkit |
| Forms & Validation | React Hook Form + Yup |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Styling | Custom CSS with CSS Variables (dark theme) |

---

## ✨ Features

### Employee Management
- Create, View, Edit, Delete employees
- Fields: Name, Position, Official Email (unique), Profile Image
- Avatar fallback with initials
- Search/filter employees

### Project Management
- Full CRUD for projects
- Fields: Title, Description, Logo, Start/End DateTime, Assigned Employees
- Employee multi-select chip UI
- Project detail view with task overview and team
- Date validation (start < end)

### Task Management
- Linked to existing projects only
- Employee dropdown filtered to project-assigned employees only
- Fields: Title, Description, Assigned Employee, ETA, Reference Images
- Full CRUD with modal forms

### Kanban Board (Dashboard)
- 5 columns: Need to Do · In Progress · Need for Test · Completed · Re-open
- Drag-and-drop between columns (@dnd-kit)
- Filter by project via dropdown
- Task cards show: title, description, employee avatar, ETA, reference image

### Main Dashboard
- Stats: Employees, Projects, Tasks, Completion Rate
- Task status breakdown with progress bars
- Recent tasks and projects
- Team overview

---

## 🛠 Setup & Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/pm-dashboard.git
cd pm-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm start

# 4. Open in browser
# http://localhost:3000
```

### Build for Production
```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Modal.jsx          # Reusable modal
│   │   ├── ConfirmDialog.jsx  # Delete confirmation
│   │   ├── FileUpload.jsx     # Image upload with preview
│   │   └── Sidebar.jsx        # Navigation sidebar
│   ├── dashboard/
│   │   └── DashboardPage.jsx  # Overview & stats
│   ├── employees/
│   │   ├── EmployeesPage.jsx  # Employee list + CRUD
│   │   └── EmployeeForm.jsx   # Employee form with validation
│   ├── projects/
│   │   ├── ProjectsPage.jsx   # Project list + detail + CRUD
│   │   └── ProjectForm.jsx    # Project form with employee chips
│   └── tasks/
│       ├── TasksPage.jsx      # Kanban board + drag-and-drop
│       └── TaskForm.jsx       # Task form with project-linked employees
├── store/
│   ├── index.js               # Redux store config
│   └── slices/
│       ├── employeesSlice.js
│       ├── projectsSlice.js
│       └── tasksSlice.js
├── utils/
│   └── validationSchemas.js   # Yup schemas for all forms
├── App.jsx                    # Router + layout
├── index.js                   # Entry point
└── index.css                  # Global styles + design system
```

---

## ✅ Validation Rules

- All fields are required
- Email must be valid format and globally unique
- Project start date must be before end date
- Task employee dropdown only shows employees assigned to the selected project
- Profile image and project logo are required via file upload

---

## 🎨 Design Decisions

- **Dark theme** with CSS custom properties for consistent theming
- **Syne + DM Sans** font pairing for a modern, distinctive look
- **Accent colors** per status: purple (in progress), green (done), orange (testing), red (re-open)
- Fully responsive with mobile sidebar toggle
- Smooth animations on page load, modals, and card hover

---

## 📦 Dependencies

```json
{
  "@dnd-kit/core": "^6.1.0",
  "@dnd-kit/sortable": "^8.0.0",
  "@dnd-kit/utilities": "^3.2.2",
  "@hookform/resolvers": "^3.3.4",
  "@reduxjs/toolkit": "^2.2.1",
  "react-hook-form": "^7.51.0",
  "react-redux": "^9.1.0",
  "react-router-dom": "^6.22.3",
  "uuid": "^9.0.0",
  "yup": "^1.4.0"
}
```

---

## 🔗 Live Demo

> Add your deployed URL here (e.g. Vercel / Netlify)

---

*Built for Powersoft Techno Solutions Technical Assessment*

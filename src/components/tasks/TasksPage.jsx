import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { addTask, updateTask, deleteTask, moveTask } from '../../store/slices/tasksSlice';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import TaskForm from './TaskForm';

const COLUMNS = [
  { id: 'todo',       label: 'Need to Do',     color: '#9090a8', badge: 'badge-todo' },
  { id: 'inprogress', label: 'In Progress',    color: '#6c63ff', badge: 'badge-progress' },
  { id: 'needtest',   label: 'Need for Test',  color: '#f7971e', badge: 'badge-test' },
  { id: 'completed',  label: 'Completed',      color: '#43e97b', badge: 'badge-done' },
  { id: 'reopen',     label: 'Re-open',        color: '#ff6584', badge: 'badge-reopen' },
];

function formatEta(eta) {
  if (!eta) return '';
  return new Date(eta).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function MiniAvatar({ employee }) {
  if (!employee) return null;
  if (employee.profileImage) {
    return <img src={employee.profileImage} alt={employee.name} style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }} />;
  }
  const initials = employee.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', fontWeight: 700 }}>
      {initials}
    </div>
  );
}

function TaskCard({ task, employee, onEdit, onDelete, isDragging }) {
  return (
    <div className={`task-card ${isDragging ? 'dragging' : ''}`} style={{ opacity: isDragging ? 0.4 : 1 }}>
      {task.referenceImages?.length > 0 && (
        <img src={task.referenceImages[0]} alt="ref" className="task-ref-img" />
      )}
      <div className="task-card-title">{task.title}</div>
      <div className="task-card-desc">{task.description}</div>
      <div className="task-card-meta">
        <div className="task-assignee">
          <MiniAvatar employee={employee} />
          <span>{employee?.name || 'Unassigned'}</span>
        </div>
        <div className="task-eta">📅 {formatEta(task.eta)}</div>
      </div>
      <div className="task-card-actions">
        <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={onEdit}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit
        </button>
        <button className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={onDelete}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
          Delete
        </button>
      </div>
    </div>
  );
}

function DraggableTaskCard({ task, employee, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: task.id });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={{ touchAction: 'none' }}>
      <TaskCard task={task} employee={employee} onEdit={onEdit} onDelete={onDelete} isDragging={isDragging} />
    </div>
  );
}

function DroppableColumn({ column, tasks, employees, onEdit, onDelete, activeId }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  return (
    <div className="kanban-column">
      <div className="kanban-col-header">
        <div className="kanban-col-title">
          <span className="col-dot" style={{ background: column.color }} />
          {column.label}
        </div>
        <span className="col-count">{tasks.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={`kanban-col-body kanban-drop-zone ${isOver ? 'over' : ''}`}
        style={{ minHeight: 80 }}
      >
        {tasks.map(task => {
          const emp = employees.find(e => e.id === task.assignedEmployee);
          return (
            <DraggableTaskCard
              key={task.id}
              task={task}
              employee={emp}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task)}
            />
          );
        })}
        {tasks.length === 0 && !activeId && (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text3)', fontSize: 12 }}>
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}

export default function TasksPage() {
  const dispatch = useDispatch();
  const tasks = useSelector(s => s.tasks.tasks);
  const projects = useSelector(s => s.projects.projects);
  const employees = useSelector(s => s.employees.employees);

  const [filterProject, setFilterProject] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const filteredTasks = filterProject
    ? tasks.filter(t => t.projectId === filterProject)
    : tasks;

  const openAdd = () => { setEditTarget(null); setShowForm(true); };
  const openEdit = (task) => { setEditTarget(task); setShowForm(true); };

  const handleSubmit = (data) => {
    if (editTarget) {
      dispatch(updateTask({ ...editTarget, ...data, status: editTarget.status }));
    } else {
      dispatch(addTask({ ...data, status: 'todo' }));
    }
    setShowForm(false);
  };

  const handleDragStart = (event) => setActiveId(event.active.id);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const taskId = active.id;
    const newStatus = over.id;
    if (COLUMNS.find(c => c.id === newStatus)) {
      dispatch(moveTask({ taskId, newStatus }));
    }
  };

  const activeTask = tasks.find(t => t.id === activeId);
  const activeEmp = activeTask ? employees.find(e => e.id === activeTask.assignedEmployee) : null;

  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <h2>Task Board</h2>
          <p>Drag and drop tasks between columns</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Task
        </button>
      </div>

      <div className="filter-bar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text2)' }}>
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
        </svg>
        <select
          className="form-input"
          value={filterProject}
          onChange={e => setFilterProject(e.target.value)}
          style={{ width: 'auto', minWidth: 220 }}
        >
          <option value="">All Projects</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
        <span style={{ color: 'var(--text2)', fontSize: 13 }}>
          {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="kanban-board">
          {COLUMNS.map(col => (
            <DroppableColumn
              key={col.id}
              column={col}
              tasks={filteredTasks.filter(t => t.status === col.id)}
              employees={employees}
              onEdit={openEdit}
              onDelete={task => setDeleteTarget(task)}
              activeId={activeId}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div style={{ transform: 'rotate(3deg)', cursor: 'grabbing' }}>
              <TaskCard
                task={activeTask}
                employee={activeEmp}
                onEdit={() => {}}
                onDelete={() => {}}
                isDragging={false}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editTarget ? 'Edit Task' : 'Add Task'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="btn btn-primary" type="submit" form="task-form">
              {editTarget ? 'Save Changes' : 'Add Task'}
            </button>
          </>
        }
      >
        <TaskForm
          onSubmit={handleSubmit}
          defaultValues={editTarget}
          preselectedProjectId={filterProject}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => dispatch(deleteTask(deleteTarget?.id))}
        message={`Delete task "${deleteTarget?.title}"?`}
      />
    </div>
  );
}

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProject, updateProject, deleteProject } from '../../store/slices/projectsSlice';
import { deleteTasksByProject } from '../../store/slices/tasksSlice';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import ProjectForm from './ProjectForm';

function formatDate(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function ProjectDetail({ project, employees, tasks, onClose, onEdit }) {
  const assigned = employees.filter(e => project.assignedEmployees?.includes(e.id));
  const projTasks = tasks.filter(t => t.projectId === project.id);
  const statusMap = { todo: 0, inprogress: 0, needtest: 0, completed: 0, reopen: 0 };
  projTasks.forEach(t => { if (statusMap[t.status] !== undefined) statusMap[t.status]++; });

  return (
    <div className="page-enter">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button className="btn btn-secondary btn-sm" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
        <button className="btn btn-primary btn-sm" onClick={onEdit}>Edit Project</button>
      </div>

      <div className="detail-header">
        {project.logo
          ? <img src={project.logo} alt={project.title} className="detail-logo" />
          : <div className="project-logo-placeholder" style={{ width: 64, height: 64, fontSize: 22 }}>
              {project.title[0]}
            </div>
        }
        <div>
          <div className="detail-title">{project.title}</div>
          <div className="detail-desc">{project.description}</div>
        </div>
      </div>

      <div className="detail-grid">
        <div className="info-block"><div className="label">Start Date</div><div className="value">{formatDate(project.startDate)}</div></div>
        <div className="info-block"><div className="label">End Date</div><div className="value">{formatDate(project.endDate)}</div></div>
        <div className="info-block"><div className="label">Total Tasks</div><div className="value">{projTasks.length}</div></div>
        <div className="info-block"><div className="label">Completed</div><div className="value" style={{ color: 'var(--accent3)' }}>{statusMap.completed}</div></div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: 14 }}>Assigned Team</h4>
        {assigned.length === 0
          ? <p style={{ color: 'var(--text3)', fontSize: 13 }}>No employees assigned</p>
          : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {assigned.map(emp => (
                <div key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg3)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  {emp.profileImage
                    ? <img src={emp.profileImage} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} alt={emp.name} />
                    : <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff', fontWeight: 700 }}>
                        {emp.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                      </div>
                  }
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{emp.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text2)' }}>{emp.position}</div>
                  </div>
                </div>
              ))}
            </div>
        }
      </div>

      <div className="card">
        <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: 14 }}>Task Overview</h4>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[['todo', 'Need to Do', 'var(--text2)'], ['inprogress', 'In Progress', 'var(--accent)'], ['needtest', 'Need for Test', 'var(--accent4)'], ['completed', 'Completed', 'var(--accent3)'], ['reopen', 'Re-open', 'var(--accent2)']].map(([key, label, color]) => (
            <div key={key} style={{ background: 'var(--bg3)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', textAlign: 'center', minWidth: 90 }}>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-display)', color }}>{statusMap[key]}</div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const dispatch = useDispatch();
  const projects = useSelector(s => s.projects.projects);
  const employees = useSelector(s => s.employees.employees);
  const tasks = useSelector(s => s.tasks.tasks);

  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditTarget(null); setShowForm(true); };
  const openEdit = (proj) => { setEditTarget(proj); setShowForm(true); setDetailTarget(null); };

  const handleSubmit = (data) => {
    if (editTarget) {
      dispatch(updateProject({ ...editTarget, ...data }));
    } else {
      dispatch(addProject(data));
    }
    setShowForm(false);
  };

  const handleDelete = () => {
    dispatch(deleteTasksByProject(deleteTarget.id));
    dispatch(deleteProject(deleteTarget.id));
    setDetailTarget(null);
  };

  if (detailTarget) {
    const project = projects.find(p => p.id === detailTarget.id) || detailTarget;
    return (
      <div className="page-enter">
        <ProjectDetail
          project={project}
          employees={employees}
          tasks={tasks}
          onClose={() => setDetailTarget(null)}
          onEdit={() => openEdit(project)}
        />
        <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Edit Project"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary" type="submit" form="project-form">Save Changes</button>
            </>
          }
        >
          <ProjectForm onSubmit={handleSubmit} defaultValues={editTarget} />
        </Modal>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <h2>Projects</h2>
          <p>{projects.length} active projects</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Project
        </button>
      </div>

      <div className="search-input" style={{ maxWidth: 360, marginBottom: 20 }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input className="form-input" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
          <h3>No projects found</h3>
          <p>{search ? 'Try a different search term' : 'Create your first project'}</p>
        </div>
      ) : (
        <div className="card-grid">
          {filtered.map(proj => {
            const assigned = employees.filter(e => proj.assignedEmployees?.includes(e.id));
            const shown = assigned.slice(0, 3);
            const extra = assigned.length - 3;
            return (
              <div className="project-card" key={proj.id} onClick={() => setDetailTarget(proj)}>
                <div className="project-card-header">
                  {proj.logo
                    ? <img src={proj.logo} alt={proj.title} className="project-logo" />
                    : <div className="project-logo-placeholder">{proj.title[0]}</div>
                  }
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="project-title">{proj.title}</div>
                    <div className="project-desc">{proj.description}</div>
                  </div>
                </div>
                <div className="project-card-body">
                  <div className="project-meta">
                    <div className="project-dates">
                      <span>Start: {formatDate(proj.startDate)}</span>
                      <span>End: {formatDate(proj.endDate)}</span>
                    </div>
                    <div className="emp-avatars">
                      {shown.map(emp => emp.profileImage
                        ? <img key={emp.id} src={emp.profileImage} className="mini-avatar" alt={emp.name} title={emp.name} />
                        : <div key={emp.id} className="mini-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent)', color: '#fff', fontSize: 9, fontWeight: 700 }} title={emp.name}>
                            {emp.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                          </div>
                      )}
                      {extra > 0 && <div className="mini-avatar-count">+{extra}</div>}
                    </div>
                  </div>
                </div>
                <div className="project-card-footer" onClick={e => e.stopPropagation()}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setDetailTarget(proj)}>View</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(proj)}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(proj)}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editTarget ? 'Edit Project' : 'New Project'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="btn btn-primary" type="submit" form="project-form">
              {editTarget ? 'Save Changes' : 'Create Project'}
            </button>
          </>
        }
      >
        <ProjectForm onSubmit={handleSubmit} defaultValues={editTarget} />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        message={`Delete "${deleteTarget?.title}" and all its tasks?`}
      />
    </div>
  );
}

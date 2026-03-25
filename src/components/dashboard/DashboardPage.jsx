import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function formatDate(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

const STATUS_META = {
  todo:       { label: 'Need to Do',    color: 'var(--text2)',   badge: 'badge-todo' },
  inprogress: { label: 'In Progress',   color: 'var(--accent)',  badge: 'badge-progress' },
  needtest:   { label: 'Need for Test', color: 'var(--accent4)', badge: 'badge-test' },
  completed:  { label: 'Completed',     color: 'var(--accent3)', badge: 'badge-done' },
  reopen:     { label: 'Re-open',       color: 'var(--accent2)', badge: 'badge-reopen' },
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const employees = useSelector(s => s.employees.employees);
  const projects = useSelector(s => s.projects.projects);
  const tasks = useSelector(s => s.tasks.tasks);

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'inprogress').length;

  const recentProjects = [...projects].slice(-4).reverse();
  const recentTasks = [...tasks].slice(-5).reverse();

  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'todo').length,
    inprogress: tasks.filter(t => t.status === 'inprogress').length,
    needtest: tasks.filter(t => t.status === 'needtest').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    reopen: tasks.filter(t => t.status === 'reopen').length,
  };

  const completionRate = tasks.length > 0
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Welcome back! Here's what's happening.</p>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text2)', textAlign: 'right' }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card purple" onClick={() => navigate('/employees')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="stat-num">{employees.length}</div>
              <div className="stat-label">Total Employees</div>
            </div>
            <div style={{ background: 'rgba(108,99,255,0.15)', padding: 10, borderRadius: 'var(--radius-sm)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
            </div>
          </div>
        </div>

        <div className="stat-card pink" onClick={() => navigate('/projects')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="stat-num">{projects.length}</div>
              <div className="stat-label">Active Projects</div>
            </div>
            <div style={{ background: 'rgba(255,101,132,0.15)', padding: 10, borderRadius: 'var(--radius-sm)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent2)" strokeWidth="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
            </div>
          </div>
        </div>

        <div className="stat-card green" onClick={() => navigate('/tasks')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="stat-num">{tasks.length}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
            <div style={{ background: 'rgba(67,233,123,0.15)', padding: 10, borderRadius: 'var(--radius-sm)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent3)" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
            </div>
          </div>
        </div>

        <div className="stat-card orange">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="stat-num">{completionRate}%</div>
              <div className="stat-label">Completion Rate</div>
            </div>
            <div style={{ background: 'rgba(247,151,30,0.15)', padding: 10, borderRadius: 'var(--radius-sm)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent4)" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
          </div>
          <div style={{ marginTop: 12, background: 'var(--bg3)', borderRadius: 99, height: 4, overflow: 'hidden' }}>
            <div style={{ width: `${completionRate}%`, height: '100%', background: 'var(--accent4)', borderRadius: 99, transition: 'width 0.6s ease' }} />
          </div>
        </div>
      </div>

      <div className="detail-grid" style={{ marginBottom: 24 }}>
        {/* Task Status Breakdown */}
        <div className="card">
          <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16, fontSize: 16 }}>Task Status</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(tasksByStatus).map(([status, count]) => {
              const meta = STATUS_META[status];
              const pct = tasks.length > 0 ? (count / tasks.length) * 100 : 0;
              return (
                <div key={status}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--text2)' }}>{meta.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: meta.color }}>{count}</span>
                  </div>
                  <div style={{ background: 'var(--bg3)', borderRadius: 99, height: 6, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: meta.color, borderRadius: 99, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16, fontSize: 16 }}>Recent Tasks</h4>
          {recentTasks.length === 0 ? (
            <p style={{ color: 'var(--text3)', fontSize: 13 }}>No tasks yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentTasks.map(task => {
                const emp = employees.find(e => e.id === task.assignedEmployee);
                const meta = STATUS_META[task.status];
                const project = projects.find(p => p.id === task.projectId);
                return (
                  <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: meta?.color, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)' }}>{project?.title} · {emp?.name || 'Unassigned'}</div>
                    </div>
                    <span className={`badge ${meta?.badge}`}>{meta?.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Projects */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>Recent Projects</h4>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/projects')}>View All</button>
        </div>
        {recentProjects.length === 0 ? (
          <p style={{ color: 'var(--text3)', fontSize: 13 }}>No projects yet. <span style={{ color: 'var(--accent)', cursor: 'pointer' }} onClick={() => navigate('/projects')}>Create one →</span></p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {recentProjects.map((proj, i) => {
              const assigned = employees.filter(e => proj.assignedEmployees?.includes(e.id));
              const projTasks = tasks.filter(t => t.projectId === proj.id);
              const done = projTasks.filter(t => t.status === 'completed').length;
              const pct = projTasks.length > 0 ? (done / projTasks.length) * 100 : 0;
              return (
                <div
                  key={proj.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < recentProjects.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}
                  onClick={() => navigate('/projects')}
                >
                  {proj.logo
                    ? <img src={proj.logo} style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} alt={proj.title} />
                    : <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg,var(--accent),var(--accent5))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', fontSize: 16 }}>{proj.title[0]}</div>
                  }
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{proj.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 6 }}>{projTasks.length} tasks · {assigned.length} members · Due {formatDate(proj.endDate)}</div>
                    <div style={{ background: 'var(--bg3)', borderRadius: 99, height: 4 }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent3)', borderRadius: 99, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--accent3)' }}>{Math.round(pct)}%</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>done</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Team */}
      <div className="card" style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>Team Members</h4>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/employees')}>View All</button>
        </div>
        {employees.length === 0 ? (
          <p style={{ color: 'var(--text3)', fontSize: 13 }}>No employees added yet.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {employees.map(emp => {
              const empTasks = tasks.filter(t => t.assignedEmployee === emp.id);
              const empDone = empTasks.filter(t => t.status === 'completed').length;
              const initials = emp.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
              return (
                <div key={emp.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, minWidth: 200, flex: '1 1 200px' }}>
                  {emp.profileImage
                    ? <img src={emp.profileImage} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} alt={emp.name} />
                    : <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,var(--accent),var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', fontSize: 14 }}>{initials}</div>
                  }
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{emp.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text2)' }}>{emp.position}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{empTasks.length} tasks · {empDone} done</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

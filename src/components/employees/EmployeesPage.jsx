import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addEmployee, updateEmployee, deleteEmployee } from '../../store/slices/employeesSlice';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import EmployeeForm from './EmployeeForm';

function AvatarPlaceholder({ name }) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  return <div className="emp-avatar-placeholder">{initials}</div>;
}

export default function EmployeesPage() {
  const dispatch = useDispatch();
  const employees = useSelector(s => s.employees.employees);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState(null);

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.position.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditTarget(null); setFormData(null); setShowForm(true); };
  const openEdit = (emp) => { setEditTarget(emp); setFormData(emp); setShowForm(true); };

  const handleSubmit = (data) => {
    if (editTarget) {
      dispatch(updateEmployee({ ...editTarget, ...data }));
    } else {
      dispatch(addEmployee(data));
    }
    setShowForm(false);
  };

  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <h2>Employees</h2>
          <p>{employees.length} team members</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Employee
        </button>
      </div>

      <div className="search-input" style={{ maxWidth: 360, marginBottom: 20 }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input className="form-input" placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
          <h3>No employees found</h3>
          <p>{search ? 'Try a different search term' : 'Add your first employee to get started'}</p>
        </div>
      ) : (
        <div className="card-grid">
          {filtered.map(emp => (
            <div className="employee-card" key={emp.id}>
              {emp.profileImage
                ? <img src={emp.profileImage} alt={emp.name} className="emp-avatar" />
                : <AvatarPlaceholder name={emp.name} />
              }
              <div className="emp-info">
                <div className="emp-name">{emp.name}</div>
                <div className="emp-position">{emp.position}</div>
                <div className="emp-email">{emp.email}</div>
              </div>
              <div className="emp-actions">
                <button className="btn btn-secondary btn-sm btn-icon" title="Edit" onClick={() => openEdit(emp)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button className="btn btn-danger btn-sm btn-icon" title="Delete" onClick={() => setDeleteTarget(emp)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editTarget ? 'Edit Employee' : 'Add Employee'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="btn btn-primary" type="submit" form="employee-form">
              {editTarget ? 'Save Changes' : 'Add Employee'}
            </button>
          </>
        }
      >
        <EmployeeForm onSubmit={handleSubmit} defaultValues={formData} isEdit={!!editTarget} />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => dispatch(deleteEmployee(deleteTarget?.id))}
        message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
      />
    </div>
  );
}

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from 'react-redux';
import { projectSchema } from '../../utils/validationSchemas';
import FileUpload from '../common/FileUpload';

export default function ProjectForm({ onSubmit, defaultValues }) {
  const employees = useSelector(s => s.employees.employees);

  const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm({
    resolver: yupResolver(projectSchema),
    defaultValues: defaultValues || {
      title: '', description: '', logo: null,
      startDate: '', endDate: '', assignedEmployees: [],
    },
  });

  const logo = watch('logo');
  const assignedEmployees = watch('assignedEmployees') || [];

  const toggleEmployee = (id) => {
    const current = assignedEmployees || [];
    const updated = current.includes(id) ? current.filter(e => e !== id) : [...current, id];
    setValue('assignedEmployees', updated, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="project-form">
      <div className="form-group">
        <label className="form-label">Project Title *</label>
        <input {...register('title')} className="form-input" placeholder="My Awesome Project" />
        {errors.title && <p className="form-error">⚠ {errors.title.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Description *</label>
        <textarea {...register('description')} className="form-input" placeholder="Describe the project..." rows={3} />
        {errors.description && <p className="form-error">⚠ {errors.description.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Project Logo</label>
        <FileUpload label="project logo" value={logo} onChange={val => setValue('logo', val)} />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Start Date & Time *</label>
          <input {...register('startDate')} type="datetime-local" className="form-input" />
          {errors.startDate && <p className="form-error">⚠ {errors.startDate.message}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">End Date & Time *</label>
          <input {...register('endDate')} type="datetime-local" className="form-input" />
          {errors.endDate && <p className="form-error">⚠ {errors.endDate.message}</p>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Assign Employees *</label>
        {employees.length === 0 ? (
          <p style={{ color: 'var(--text3)', fontSize: 13 }}>No employees available. Add employees first.</p>
        ) : (
          <div className="chip-select">
            {employees.map(emp => (
              <div
                key={emp.id}
                className={`chip ${assignedEmployees.includes(emp.id) ? 'selected' : ''}`}
                onClick={() => toggleEmployee(emp.id)}
              >
                {emp.profileImage
                  ? <img src={emp.profileImage} alt={emp.name} />
                  : <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', fontWeight: 700 }}>
                      {emp.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                    </span>
                }
                {emp.name}
              </div>
            ))}
          </div>
        )}
        {errors.assignedEmployees && <p className="form-error">⚠ {errors.assignedEmployees.message}</p>}
      </div>
    </form>
  );
}

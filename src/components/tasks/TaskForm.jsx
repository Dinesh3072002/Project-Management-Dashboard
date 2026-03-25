import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from 'react-redux';
import { taskSchema } from '../../utils/validationSchemas';
import FileUpload from '../common/FileUpload';

export default function TaskForm({ onSubmit, defaultValues, preselectedProjectId }) {
  const projects = useSelector(s => s.projects.projects);
  const employees = useSelector(s => s.employees.employees);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(taskSchema),
    defaultValues: defaultValues || {
      projectId: preselectedProjectId || '',
      title: '',
      description: '',
      assignedEmployee: '',
      eta: '',
      referenceImages: [],
    },
  });

  const projectId = watch('projectId');
  const referenceImages = watch('referenceImages') || [];

  const selectedProject = projects.find(p => p.id === projectId);
  const availableEmployees = selectedProject
    ? employees.filter(e => selectedProject.assignedEmployees?.includes(e.id))
    : [];

  useEffect(() => {
    if (!defaultValues) setValue('assignedEmployee', '');
  }, [projectId]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="task-form">
      <div className="form-group">
        <label className="form-label">Project *</label>
        <select {...register('projectId')} className="form-input">
          <option value="">Select a project</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
        {errors.projectId && <p className="form-error">⚠ {errors.projectId.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Task Title *</label>
        <input {...register('title')} className="form-input" placeholder="Implement login page" />
        {errors.title && <p className="form-error">⚠ {errors.title.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Description *</label>
        <textarea {...register('description')} className="form-input" placeholder="Describe the task..." rows={3} />
        {errors.description && <p className="form-error">⚠ {errors.description.message}</p>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Assign Employee *</label>
          <select {...register('assignedEmployee')} className="form-input" disabled={!projectId}>
            <option value="">
              {!projectId ? 'Select a project first' : availableEmployees.length === 0 ? 'No employees assigned' : 'Select employee'}
            </option>
            {availableEmployees.map(e => (
              <option key={e.id} value={e.id}>{e.name} — {e.position}</option>
            ))}
          </select>
          {errors.assignedEmployee && <p className="form-error">⚠ {errors.assignedEmployee.message}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">ETA *</label>
          <input {...register('eta')} type="date" className="form-input" />
          {errors.eta && <p className="form-error">⚠ {errors.eta.message}</p>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Reference Images</label>
        <FileUpload
          label="reference images"
          value={referenceImages}
          multiple
          onChange={vals => setValue('referenceImages', vals)}
        />
      </div>
    </form>
  );
}

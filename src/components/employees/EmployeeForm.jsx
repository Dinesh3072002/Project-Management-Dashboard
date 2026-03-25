import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from 'react-redux';
import { employeeSchema } from '../../utils/validationSchemas';
import FileUpload from '../common/FileUpload';

export default function EmployeeForm({ onSubmit, defaultValues, isEdit }) {
  const allEmployees = useSelector(s => s.employees.employees);
  const existingEmails = allEmployees.map(e => e.email.toLowerCase());
  const currentEmail = defaultValues?.email?.toLowerCase() || '';

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(employeeSchema(existingEmails, currentEmail)),
    defaultValues: defaultValues || { name: '', position: '', email: '', profileImage: '' },
  });

  const profileImage = watch('profileImage');

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="employee-form">
      <div className="form-group">
        <label className="form-label">Full Name *</label>
        <input {...register('name')} className="form-input" placeholder="John Doe" />
        {errors.name && <p className="form-error">⚠ {errors.name.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Position *</label>
        <input {...register('position')} className="form-input" placeholder="Frontend Developer" />
        {errors.position && <p className="form-error">⚠ {errors.position.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Official Email ID *</label>
        <input {...register('email')} className="form-input" placeholder="john@company.com" type="email" />
        {errors.email && <p className="form-error">⚠ {errors.email.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Profile Image *</label>
        <FileUpload
          label="profile photo"
          value={profileImage}
          onChange={(val) => setValue('profileImage', val, { shouldValidate: true })}
        />
        {errors.profileImage && <p className="form-error">⚠ {errors.profileImage.message}</p>}
      </div>
    </form>
  );
}

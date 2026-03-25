import * as yup from 'yup';

export const employeeSchema = (existingEmails = [], currentEmail = '') =>
  yup.object({
    name: yup.string().required('Name is required'),
    position: yup.string().required('Position is required'),
    email: yup
      .string()
      .email('Must be a valid email')
      .required('Email is required')
      .test('unique-email', 'Email already exists', function (value) {
        if (!value) return true;
        const others = existingEmails.filter(e => e !== currentEmail);
        return !others.includes(value.toLowerCase());
      }),
    profileImage: yup.string().required('Profile image is required'),
  });

export const projectSchema = yup.object({
  title: yup.string().required('Project title is required'),
  description: yup.string().required('Description is required'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup
    .string()
    .required('End date is required')
    .test('end-after-start', 'End date must be after start date', function (value) {
      const { startDate } = this.parent;
      if (!startDate || !value) return true;
      return new Date(value) > new Date(startDate);
    }),
  assignedEmployees: yup
    .array()
    .min(1, 'Assign at least one employee')
    .required('Assign at least one employee'),
});

export const taskSchema = yup.object({
  projectId: yup.string().required('Project is required'),
  title: yup.string().required('Task title is required'),
  description: yup.string().required('Description is required'),
  assignedEmployee: yup.string().required('Assign an employee'),
  eta: yup.string().required('ETA is required'),
});

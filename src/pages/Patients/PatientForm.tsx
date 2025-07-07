import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format, parseISO, isValid } from 'date-fns';

import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import  Spinner  from '../../components/ui/LoadingSpinner';

import { useData } from '../../context/DataContext';
import { Patient } from '../../types/types';

interface FormState extends Omit<Patient, 'id'> {}

const PatientForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { patients, addPatient, updatePatient } = useData();

  const editing = Boolean(id && id !== 'new');
  const [isLoading, setIsLoading] = useState(editing);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [form, setForm] = useState<FormState>({
    name: '',
    dob: '',
    contact: '',
    email: '',
    gender: '',
    address: '',
    healthInfo: '',
  });

  
  useEffect(() => {
    if (!editing) return;

    setIsLoading(true);
    const patient = patients.find((p) => p.id === id);
    if (!patient) {
      toast.error('Patient not found');
      navigate('/patients');
      return;
    }

    
    const { id: _omit, dob, ...rest } = patient;
    const formattedDob = dob && isValid(parseISO(dob)) ? format(parseISO(dob), 'yyyy-MM-dd') : '';
    setForm({ ...rest, dob: formattedDob });
    setIsLoading(false);
  }, [editing, id, patients, navigate]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      if (errors[name as keyof FormState]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    },
    [errors]
  );


  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};

    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.dob) newErrors.dob = 'Date of birth is required';
    if (!form.contact) newErrors.contact = 'Contact is required';

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (form.contact && !/^[\d\s+\-()]{7,}$/.test(form.contact)) {
      newErrors.contact = 'Please enter a valid phone number';
    }

    if (form.dob) {
      const dobDate = new Date(form.dob);
      if (dobDate > new Date()) newErrors.dob = 'Date of birth cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    try {
      const payload: Omit<Patient, 'id'> = {
        ...form,
        dob: form.dob ? new Date(form.dob).toISOString() : '',
      };

      if (editing && id) {
        await updatePatient(id, payload);
        toast.success('Patient updated successfully');
      } else {
        await addPatient(payload);
        toast.success('Patient added successfully');
      }

      navigate('/patients');
    } catch (error) {
      toast.error(`Failed to ${editing ? 'update' : 'add'} patient`);
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          {editing ? 'Edit Patient' : 'Add New Patient'}
        </h2>
        <p className="mt-2 text-gray-600">
          {editing ? 'Update patient information' : 'Fill in the details to register a new patient'}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow">
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <Input
            label="Full Name *"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

          <Input
            label="Date of Birth *"
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            error={errors.dob}
            max={format(new Date(), 'yyyy-MM-dd')}
            required
          />

          <Input
            label="Contact Number *"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            error={errors.contact}
            required
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          {/* Gender */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.gender ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <Input
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
          />
        </div>

        {/* Health info */}
        <div className="mb-8">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Health Information / Medical History
          </label>
          <textarea
            name="healthInfo"
            rows={4}
            value={form.healthInfo}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Allergies, chronic conditions, medications, etc."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 border-t pt-4">
          <Button type="button" variant="secondary" onClick={() => navigate('/patients')} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting} disabled={submitting}>
            {editing ? 'Update Patient' : 'Create Patient'}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default PatientForm;

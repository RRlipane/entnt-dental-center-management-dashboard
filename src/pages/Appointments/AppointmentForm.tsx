import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Input }      from '../../components/ui/Input';
import { Button }     from '../../components/ui/Button';
import Spinner        from '../../components/ui/LoadingSpinner';
import { FileUpload } from '../../components/FileUpload';

import { useData }     from '../../context/DataContext';
import { Appointment } from '../../types/types';


interface FormState extends Omit<Appointment, 'id' | 'files'> {
  files: Array<{ name: string; url: string }>;
}

const AppointmentForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    patients,
    appointments,
    addAppointment,
    updateAppointment,
    getPatientById,
    isLoading: dataLoading,
  } = useData();

  const editing  = Boolean(id && id !== 'new');
  const viewOnly = Boolean(id && id.endsWith('/view'));

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>({
    patientId: '',
    title: '',
    appointmentDate: '',
    description: '',
    comments: '',
    status: 'Scheduled',
    cost: 0,
    treatment: '',
    nextDate: '',
    files: [],
  });

  
  useEffect(() => {
    if (!editing || dataLoading) return;
    const appt = appointments.find(a => a.id === id);
    if (!appt) {
      toast.error('Appointment not found');
      navigate('/appointments');
      return;
    }
   
    const { id: _omit, files = [], ...rest } = appt;
    setForm({ ...rest, files });
  }, [editing, id, appointments, dataLoading, navigate]);


const handleChange = useCallback(
  (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      
      [name]: name === 'cost' ? Number(value) : value,
    }));
  },
  [],
);

 
  const handleFileUpload = (f: Array<{ name: string; url: string }>) =>
    setForm(prev => ({ ...prev, files: [...prev.files, ...f] }));

  const handleFileDelete = (idx: number) =>
    setForm(prev => {
      const files = [...prev.files];
      files.splice(idx, 1);
      return { ...prev, files };
    });

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload: Omit<Appointment, 'id'> = {
      ...form,
      files: form.files.map(f => ({
        name: f.name,
        url: f.url.startsWith('blob:') ? 'pending-upload' : f.url,
      })),
    };

    try {
      if (editing && id) {
        await updateAppointment(id, payload);
        toast.success('Appointment updated');
      } else {
        await addAppointment(payload);
        toast.success('Appointment created');
      }
      navigate('/appointments');
    } catch (err) {
      console.error(err);
      toast.error('Could not save appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const currentPatient = getPatientById(form.patientId);

  if (dataLoading)
    return (
      <section className="flex h-64 items-center justify-center">
        <Spinner />
      </section>
    );

  /* ------------------------------ JSX ----------------------------------- */
  return (
    <section className="mx-auto max-w-3xl px-4 py-6">
      <h2 className="mb-6 text-2xl font-bold">
        {editing
          ? viewOnly
            ? 'View Appointment'
            : 'Edit Appointment'
          : 'Create Appointment'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic details */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            label="Title*"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            disabled={viewOnly}
          />

          <Input
            label="Appointment Date & Time*"
            type="datetime-local"
            name="appointmentDate"
            value={form.appointmentDate}
            onChange={handleChange}
            required
            disabled={viewOnly}
          />

          {/* Patient selector */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Patient*
            </label>
            <select
              id="patientId"
              name="patientId"
              value={form.patientId}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              disabled={editing || viewOnly}
            >
              <option value="">Select a patient</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.contact})
                </option>
              ))}
            </select>

            {currentPatient && (
              <div className="mt-2 text-sm text-gray-600">
                <p>DOB: {currentPatient.dob}</p>
                <p>Health Info: {currentPatient.healthInfo}</p>
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={viewOnly}
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <Input
            label="Cost (₹)"
            type="number"
            name="cost"
            value={form.cost}
            onChange={handleChange}
            min={0}
            step="0.01"
            disabled={viewOnly}
          />

          <Input
            label="Treatment"
            name="treatment"
            value={form.treatment}
            onChange={handleChange}
            disabled={viewOnly}
          />

          <Input
            label="Follow‑up Date"
            type="date"
            name="nextDate"
            value={form.nextDate}
            onChange={handleChange}
            disabled={viewOnly}
          />
        </div>

        {/* Notes */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          disabled={viewOnly}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Description"
        />

        <textarea
          name="comments"
          value={form.comments}
          onChange={handleChange}
          rows={3}
          disabled={viewOnly}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Clinical notes"
        />

        {/* Files */}
        <FileUpload
          onUpload={handleFileUpload}
          existingFiles={form.files}
          onDelete={handleFileDelete}
          disabled={submitting || viewOnly}
        />

        {/* Actions */}
        {!viewOnly && (
          <div className="flex justify-end space-x-4 border-t pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/appointments')}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" loading={submitting} disabled={submitting}>
              {editing ? 'Update Appointment' : 'Create Appointment'}
            </Button>
          </div>
        )}
      </form>
    </section>
  );
};

export default AppointmentForm;

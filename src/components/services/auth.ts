import { getItem, setItem, removeItem } from './storage';

import type { Database, User, Patient, Appointment } from '../../types/types';
import { UserRole } from '../../types/types'; 

const DEFAULT_DATA: Database = {
  users: [
  { id: '1', role: UserRole.Admin,   email: 'admin@entnt.in',  password: 'admin123' },
  { id: '2', role: UserRole.Patient, email: 'john@entnt.in',   password: 'patient123', patientId: 'p1' },
  { id: '3', role: UserRole.Doctor,  email: 'doctor@entnt.in', password: 'doctor123' },
],
  patients: [
    {
      id: 'p1',
      name: 'John Doe',
      dob: '1990-05-10',
      contact: '1234567890',
      email: 'john@entnt.in',
      healthInfo: 'No allergies',
    },
  ],
  appointments: [
    {
      id: 'i1',
      patientId: 'p1',
      title: 'Toothache',
      description: 'Upper molar pain',
      comments: 'Sensitive to cold',
      appointmentDate: new Date(Date.now() + 86_400_000).toISOString(), // +1 day
      cost: 80,
      status: 'Completed',
      files: [],
    },
    {
      id: 'i2',
      patientId: 'p1',
      title: 'Regular Check‑up',
      description: 'Bi‑annual dental examination',
      comments: '',
      appointmentDate: new Date(Date.now() + 2_592_000_000).toISOString(), // +30 days
      status: 'Scheduled',
      files: [],
    },
  ],
};

export const initializeAuth = (clearExisting = false): boolean => {
  try {
    if (clearExisting) {
      removeItem('users');
      removeItem('patients');
      removeItem('appointments');
    }

    const existingUsers        = getItem<User[]>('users');
    const existingPatients     = getItem<Patient[]>('patients');
    const existingAppointments = getItem<Appointment[]>('appointments');

    const dataMissing =
      !Array.isArray(existingUsers)        || existingUsers.length        === 0 ||
      !Array.isArray(existingPatients)     || existingPatients.length     === 0 ||
      !Array.isArray(existingAppointments) || existingAppointments.length === 0;

    if (dataMissing) {
      setItem('users',        DEFAULT_DATA.users);
      setItem('patients',     DEFAULT_DATA.patients);
      setItem('appointments', DEFAULT_DATA.appointments);
      return true; 
    }

    return false;  
  } catch (err) {
    console.error('Failed to initialise auth data:', err);
    setItem('users',        DEFAULT_DATA.users);
    setItem('patients',     DEFAULT_DATA.patients);
    setItem('appointments', DEFAULT_DATA.appointments);
    return true;
  }
};

export const resetAuthData = (): void => {
  initializeAuth(true);
};


// src/types/types.ts
export enum UserRole {
  Admin = 'Admin',
  Patient = 'Patient',
  Doctor = 'Doctor',
}


/* ------------------------------- User ------------------------------------ */
export interface User {
  id: string;
  role: UserRole;
  email: string;
  password: string;
  patientId?: string;
}

/* ----------------------------- Patient ----------------------------------- */
export interface Patient {
  id: string;
  name: string;
  dob: string;          // YYYY‑MM‑DD
  contact: string;
  email: string;
  healthInfo: string;
  gender?: string;
  address?: string;
}

/* --------------------------- Appointment --------------------------------- */
export interface FileAttachment {
  name: string;
  url: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  title: string;
  description: string;
  comments: string;
  appointmentDate: string;                 // ISO
  cost?: number;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  files: FileAttachment[];
  treatment?: string;
  nextDate?: string;
}

/* ------------------------------ DB --------------------------------------- */
export interface Database {
  users: User[];
  patients: Patient[];
  appointments: Appointment[];
}


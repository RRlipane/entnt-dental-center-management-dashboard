
export type Role = 'Admin' | 'Patient';

export interface User {
  id: string;
  role: Role;
  email: string;
  password: string;
  patientId?: string; 
}

/* ------------------------- Patient & contact info ------------------------- */
export interface PatientContact {
  mobile: string;
  phone?: string;
  [key: string]: any;
}

export interface Patient {
  id: string;
  name: string;
  dob: string;            
  gender?: string;
  contact?: string | PatientContact;
  email?: string;
  address?: string;
  healthInfo?: string;
}

/* -------------------------- Appointments / Incidents ---------------------- */
export interface FileAttachment {
  name: string;
  url: string;            
}

export type AppointmentStatus = 'Pending' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  title: string;
  description?: string;
  comments?: string;
  appointmentDate: string;                            // ISO string
  cost?: number | { amount: number; currency?: string };
  treatment?: string;
  status: AppointmentStatus;
  nextDate?: string;
  files?: FileAttachment[];
}

export type Incident = Appointment;

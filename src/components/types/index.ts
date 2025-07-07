
export type UserRole = 'Admin' | 'Doctor' | 'Patient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  patientId?: string; 
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
}

export interface AuthenticatedUser extends Omit<User, 'password' | 'lastLogin'> {

  token?: string;

  expiresIn?: number;
}

export type AppointmentStatus = 'Pending' | 'Completed' | 'Cancelled' | 'Scheduled';


export interface Appointment {
  id: string;
  patientId: string;
  doctorId?: string; 
  title: string;
  date: Date | string; 
  description?: string;
  cost?: number;
  status: AppointmentStatus;
  duration?: number; 
  location?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Patient {
  id: string;
  name: string;
  dob: Date | string;
  contact: string;
  email?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  healthInfo?: {
    bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    allergies?: string[];
    conditions?: string[];
    medications?: string[];
  };
  insurance?: {
    provider: string;
    policyNumber: string;
    validUntil: Date | string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}


export type IncidentStatus = 'Pending' | 'Completed' | 'Cancelled';


export interface Incident {
  id: string;
  patientId: string;
  doctorId?: string;
  title: string;
  description?: string;
  comments?: string;
  appointmentDate: Date | string;
  cost?: number;
  treatment?: string;
  status?: IncidentStatus;
  nextDate?: Date | string;
  diagnosis?: string;
  prescriptions?: Array<{
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  files?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedAt: Date | string;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}


export type DoctorSpecialization = 
  'Cardiology' | 'Dermatology' | 'Neurology' | 
  'Pediatrics' | 'Orthopedics' | 'General';


export interface Doctor {
  id: string;
  userId: string;
  name: string;
  specialization: DoctorSpecialization | string;
  licenseNumber: string;
  contact: string;
  email: string;
  schedule?: {
    daysAvailable: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[];
    hours: {
      start: string;
      end: string;
    };
  };
  bio?: string;
  photoUrl?: string;
}
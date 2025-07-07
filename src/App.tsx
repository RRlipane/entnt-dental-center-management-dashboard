
import React, { lazy, Suspense } from 'react';

import { initializeAuth } from './components/services/auth';

import { Routes, Route, Navigate } from 'react-router-dom';
import Layout         from './components/layout/Layout';
import PrivateRoute   from './components/PrivateRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';

import { UserRole }   from './types/types';      

initializeAuth();

const Login             = lazy(() => import('./pages/Login'));
const Dashboard         = lazy(() => import('./pages/Dashboard'));
const PatientsList      = lazy(() => import('./pages/Patients'));
const PatientFormLazy   = lazy(() => import('./pages/Patients/PatientForm'));
const AppointmentsList  = lazy(() => import('./pages/Appointments'));
const AppointmentFormLazy = lazy(() => import('./pages/Appointments/AppointmentForm'));
const CalendarView      = lazy(() => import('./pages/CalendarView'));
const PatientView       = lazy(() => import('./pages/PatientView'));
const NotFound          = lazy(() => import('./pages/NotFound'));

const PatientForm: React.ComponentType<{ mode: 'create' | 'edit' }> =
  PatientFormLazy as unknown as React.ComponentType<{ mode: 'create' | 'edit' }>;
const AppointmentForm: React.ComponentType<{ mode: 'create' | 'edit' }> =
  AppointmentFormLazy as unknown as React.ComponentType<{ mode: 'create' | 'edit' }>;

/* ---------- route constants ---------------------------------------------- */
const ROUTES = {
  LOGIN:        '/login',
  DASHBOARD:    '/dashboard',
  PATIENTS:     '/patients',
  NEW_PATIENT:  '/patients/new',
  PATIENT_FORM: '/patients/:id',
  APPOINTS:     '/appointments',
  NEW_APPT:     '/appointments/new',
  APPT_FORM:    '/appointments/:id',
  CALENDAR:     '/calendar',
  PROFILE:      '/profile',
};

/* -------------------------------------------------------------------------- */
const App: React.FC = () => (
  <Suspense fallback={<LoadingSpinner fullPage />}>
    <Routes>
    
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />

      <Route
        element={
          <PrivateRoute allowedRoles={[UserRole.Admin, UserRole.Doctor, UserRole.Patient]} />
        }
      >
        <Route element={<Layout />}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />

          
          <Route
            element={<PrivateRoute allowedRoles={[UserRole.Admin, UserRole.Doctor]} />}
          >
       
            <Route path={ROUTES.PATIENTS}>
              <Route index element={<PatientsList />} />
              <Route path="new" element={<PatientForm mode="create" />} />
              <Route path=":id" element={<PatientForm mode="edit" />} />
            </Route>

          
            <Route path={ROUTES.APPOINTS}>
              <Route index element={<AppointmentsList />} />
              <Route path="new" element={<AppointmentForm mode="create" />} />
              <Route path=":id" element={<AppointmentForm mode="edit" />} />
            </Route>

            
            <Route path={ROUTES.CALENDAR} element={<CalendarView />} />
          </Route>

          <Route path={ROUTES.PROFILE} element={<PatientView />} />
        </Route>
      </Route>

     
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default App;

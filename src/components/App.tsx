import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoadingSpinner   from '@/components/ui/LoadingSpinner';
import ErrorBoundary    from '@/components/common/ErrorBoundary';
import { Layout }       from '@/components/layout/Layout';   
import PrivateRouteComp from '@/components/PrivateRoute';

import { UserRole }     from '../types/types';

const PrivateRoute = PrivateRouteComp as React.ComponentType<{
  allowedRoles: UserRole[];
}>;


const Login            = lazy(() => import('../pages/Login'));
const Dashboard        = lazy(() => import('../pages/Dashboard'));
const PatientsList     = lazy(() => import('../pages/Patients'));
const PatientForm      = lazy(() =>
  import('../pages/Patients/PatientForm'),
) as React.ComponentType<{ mode: 'create' | 'edit' | 'view' }>;
const AppointmentsList = lazy(() => import('../pages/Appointments'));
const AppointmentForm  = lazy(() =>
  import('../pages/Appointments/AppointmentForm'),
) as React.ComponentType<{ mode: 'create' | 'edit' | 'view' }>;
const CalendarView     = lazy(() => import('../pages/CalendarView'));
const PatientView      = lazy(() => import('../pages/PatientView'));
const NotFound         = lazy(() => import('../pages/NotFound'));

/* ---- routes ---- */
const App: React.FC = () => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<PrivateRoute allowedRoles={[
          UserRole.Admin, UserRole.Doctor, UserRole.Patient
        ]}/>}>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />

            {/* Admin + Doctor */}
            <Route element={<PrivateRoute allowedRoles={[
              UserRole.Admin, UserRole.Doctor
            ]}/>}>
              <Route path="patients">
                <Route index element={<PatientsList />} />
                <Route path="new"   element={<PatientForm mode="create" />} />
                <Route path=":id"   element={<PatientForm mode="edit"   />} />
              </Route>

              <Route path="appointments">
                <Route index element={<AppointmentsList />} />
                <Route path="new" element={<AppointmentForm mode="create" />} />
                <Route path=":id" element={<AppointmentForm mode="edit"   />} />
              </Route>
            </Route>

            <Route path="calendar" element={<CalendarView />} />
            <Route path="profile"  element={<PatientView  />} />
          </Route>
        </Route>

        <Route path="/404" element={<NotFound />} />
        <Route path="*"    element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  </ErrorBoundary>
);

export default App;

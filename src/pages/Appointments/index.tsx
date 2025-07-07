// src/pages/Appointments/index.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { useData } from '../../context/DataContext';   // relative path

const safeFormatDate = (iso: string | undefined, fmt: string): string => {
  if (!iso) return 'N/A';
  try {
    return format(parseISO(iso), fmt);
  } catch {
    return 'N/A';
  }
};


const AppointmentsList: React.FC = () => {
  const { appointments, deleteAppointment, getPatientById, isLoading } = useData();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      await deleteAppointment(id);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center text-gray-500">Loading appointments…</div>;
  }

  return (
    <div className="p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
        <Link
          to="new"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + Add Appointment
        </Link>
      </header>

      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <Th>Date&nbsp;&amp;&nbsp;Time</Th>
              <Th>Patient</Th>
              <Th>Title</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {appointments.length ? (
              appointments.map(a => {
                const patient = getPatientById(a.patientId);
                const badgeColour =
                  a.status === 'Completed'
                    ? 'bg-green-100 text-green-800'
                    : a.status === 'Scheduled'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800';

                return (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <Td>{safeFormatDate(a.appointmentDate, 'PPpp')}</Td>
                    <Td>{patient?.name ?? 'Unknown'}</Td>
                    <Td>{a.title}</Td>
                    <Td>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${badgeColour}`}
                      >
                        {a.status}
                      </span>
                    </Td>
                    <Td className="space-x-4">
                      <Link to={`${a.id}`} className="text-indigo-600 hover:underline">
                        Edit
                      </Link>
                      <Link to={`${a.id}/view`} className="text-green-600 hover:underline">
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </Td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


interface CellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

const Th: React.FC<CellProps> = ({ children, ...rest }) => (
  <th
    {...rest}
    className={`px-6 py-3 text-left font-semibold uppercase tracking-wider text-gray-600 ${rest.className ?? ''}`}
  >
    {children}
  </th>
);

const Td: React.FC<CellProps> = ({ children, ...rest }) => (
  <td
    {...rest}
    className={`whitespace-nowrap px-6 py-4 text-gray-700 ${rest.className ?? ''}`}
  >
    {children}
  </td>
);

export default AppointmentsList;

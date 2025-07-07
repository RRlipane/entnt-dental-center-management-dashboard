import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { toast } from 'react-toastify';
import { Patient } from '../../types/types';

const PatientsList: React.FC = () => {
  const { patients, setPatients, isLoading } = useData();

  const deletePatient = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this patient and all their related data?')) return;

    try {
      
      setPatients((prev: Patient[]) => prev.filter((p: Patient) => p.id !== id));
      toast.success('Patient deleted successfully');
    } catch (error) {
      toast.error('Failed to delete patient');
      console.error('Error deleting patient:', error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading patients...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between mb-6 items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Patient Management</h1>
        <Link
          to="new"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          + Add Patient
        </Link>
      </div>

      <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.length > 0 ? (
              patients.map((patient: Patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {patient.name}
                      </div>
                      <div className="ml-2 text-xs text-gray-500">
                        ID: {patient.id.slice(0, 8)}...
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.contact || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.email || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                    <Link
                      to={`${patient.id}`}
                      className="text-indigo-600 hover:text-indigo-900 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deletePatient(patient.id)}
                      className="text-red-600 hover:text-red-900 hover:underline"
                    >
                      Delete
                    </button>
                    <Link
                      to={`${patient.id}/appointments`}
                      className="text-green-600 hover:text-green-900 hover:underline"
                    >
                      Appointments
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No patients found. Click "Add Patient" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientsList;

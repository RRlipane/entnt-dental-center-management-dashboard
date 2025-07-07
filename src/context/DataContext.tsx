import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { Patient, Appointment } from '../types/types';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

interface DataContextType {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;   // ★ NEW
  appointments: Appointment[];
  isLoading: boolean;

  getPatientById(id: string): Patient | undefined;
  getPatientAppointments(patientId: string): Appointment[];

  addPatient(p: Omit<Patient, 'id'>): Promise<Patient>;
  updatePatient(id: string, data: Partial<Patient>): Promise<void>;
  deletePatient(id: string): Promise<void>;

  addAppointment(a: Omit<Appointment, 'id'>): Promise<Appointment>;
  updateAppointment(id: string, data: Partial<Appointment>): Promise<void>;
  deleteAppointment(id: string): Promise<void>;

  addFileToAppointment(
    appointmentId: string,
    file: { name: string; url: string },
  ): Promise<void>;
  removeFileFromAppointment(
    appointmentId: string,
    fileName: string,
  ): Promise<void>;
}

const DataContext = createContext<DataContextType>({} as DataContextType);
export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const storedP = localStorage.getItem('patients');
        const storedA = localStorage.getItem('appointments');

        if (storedP && storedA) {
          setPatients(JSON.parse(storedP));
          setAppointments(JSON.parse(storedA));
        } else {
          // demo data …
          const mockPatients: Patient[] = [
            {
              id: 'p1',
              name: 'John Doe',
              dob: '1990-05-10',
              contact: '1234567890',
              email: 'john@entnt.in',
              healthInfo: 'No allergies',
              gender: 'Male',
              address: '123 Main St',
            },
          ];
          const mockAppointments: Appointment[] = [
            {
              id: 'i1',
              patientId: 'p1',
              title: 'Toothache',
              description: 'Upper molar pain',
              comments: 'Sensitive to cold',
              appointmentDate: '2025-07-01T10:00:00',
              cost: 80,
              status: 'Completed',
              treatment: 'Filling',
              nextDate: '2025-07-15',
              files: [],
            },
          ];
          setPatients(mockPatients);
          setAppointments(mockAppointments);
          localStorage.setItem('patients', JSON.stringify(mockPatients));
          localStorage.setItem('appointments', JSON.stringify(mockAppointments));
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);


  useEffect(() => {
    if (!isLoading) localStorage.setItem('patients', JSON.stringify(patients));
  }, [patients, isLoading]);

  useEffect(() => {
    if (!isLoading)
      localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments, isLoading]);

  
  const getPatientById = useCallback(
    (id: string) => patients.find(p => p.id === id),
    [patients],
  );

  const getPatientAppointments = useCallback(
    (pid: string) => appointments.filter(a => a.patientId === pid),
    [appointments],
  );

  const addPatient = useCallback(async (p: Omit<Patient, 'id'>) => {
    const newP = { ...p, id: uuidv4() };
    setPatients(prev => [...prev, newP]);
    toast.success('Patient added successfully');
    return newP;
  }, []);

  const updatePatient = useCallback(async (id: string, data: Partial<Patient>) => {
    setPatients(prev => prev.map(p => (p.id === id ? { ...p, ...data } : p)));
    toast.success('Patient updated successfully');
  }, []);

  const deletePatient = useCallback(async (id: string) => {
    setAppointments(prev => prev.filter(a => a.patientId !== id));
    setPatients(prev => prev.filter(p => p.id !== id));
    toast.success('Patient and related appointments deleted');
  }, []);

  const addAppointment = useCallback(async (a: Omit<Appointment, 'id'>) => {
    const newA = { ...a, id: uuidv4() };
    setAppointments(prev => [...prev, newA]);
    toast.success('Appointment created successfully');
    return newA;
  }, []);

  const updateAppointment = useCallback(async (id: string, data: Partial<Appointment>) => {
    setAppointments(prev => prev.map(a => (a.id === id ? { ...a, ...data } : a)));
    toast.success('Appointment updated successfully');
  }, []);

  const deleteAppointment = useCallback(async (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    toast.success('Appointment deleted successfully');
  }, []);

  const addFileToAppointment = useCallback(
    async (appointmentId: string, file: { name: string; url: string }) => {
      setAppointments(prev =>
        prev.map(a =>
          a.id === appointmentId ? { ...a, files: [...a.files, file] } : a,
        ),
      );
      toast.success('File added successfully');
    },
    [],
  );

  const removeFileFromAppointment = useCallback(
    async (appointmentId: string, fileName: string) => {
      setAppointments(prev =>
        prev.map(a =>
          a.id === appointmentId
            ? { ...a, files: a.files.filter(f => f.name !== fileName) }
            : a,
        ),
      );
      toast.success('File removed successfully');
    },
    [],
  );

  /* ------------------------------------------------------------------------ */
  return (
    <DataContext.Provider
      value={{
        patients,
        setPatients,            
        appointments,
        isLoading,

        getPatientById,
        getPatientAppointments,

        addPatient,
        updatePatient,
        deletePatient,

        addAppointment,
        updateAppointment,
        deleteAppointment,

        addFileToAppointment,
        removeFileFromAppointment,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

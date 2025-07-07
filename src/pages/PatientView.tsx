/* -------------------------------------------------------------------------- */
/*  PatientView — Patient‑side dashboard                                      */
/* -------------------------------------------------------------------------- */
import React from 'react';
import { Tab } from '@headlessui/react';
import { format, parseISO } from 'date-fns';
import {
  FiUser,
  FiCalendar,
  FiPhone,
  FiMail,
  FiMapPin,
  FiFileText,
} from 'react-icons/fi';
import { FaClinicMedical } from 'react-icons/fa';
import { BsGenderAmbiguous } from 'react-icons/bs';

import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { MedicalChart } from '../components/MedicalChart';
import { Appointment } from '../types/types';

const UserIcon     = FiUser  as React.ElementType;
const CalIcon      = FiCalendar as React.ElementType;
const PhoneIcon    = FiPhone as React.ElementType;
const MailIcon     = FiMail  as React.ElementType;
const PinIcon      = FiMapPin as React.ElementType;
const FileIcon     = FiFileText as React.ElementType;
const ClinicIcon   = FaClinicMedical as React.ElementType;
const GenderIcon   = BsGenderAmbiguous as React.ElementType;

/* -------------------------------------------------------------------------- */

const PatientView: React.FC = () => {
  const { user } = useAuth();
  const { patients, appointments } = useData();

  const me = patients.find(p => p.id === user?.patientId);
  const myVisits: Appointment[] = appointments
    .filter(a => a.patientId === user?.patientId)
    .sort(
      (a, b) =>
        new Date(b.appointmentDate).getTime() -
        new Date(a.appointmentDate).getTime(),
    );

  /* ----------------------- Missing‑profile fallback ----------------------- */
  if (!me) {
    return (
      <section className="flex min-h-[50vh] flex-col items-center justify-center">
        <div className="max-w-md rounded-lg bg-white p-8 text-center shadow-md">
          <h3 className="mb-2 text-xl font-semibold text-gray-800">
            Profile Not Found
          </h3>
          <p className="mb-4 text-gray-600">
            We couldn’t find your patient profile.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
          >
            Refresh
          </button>
        </div>
      </section>
    );
  }

  /* --------------------------- Mini components ---------------------------- */
  const ProfileField: React.FC<{
    icon: React.ReactNode;
    label: string;
    value?: string | number;
  }> = ({ icon, label, value }) =>
    value ? (
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-indigo-50 p-2 text-indigo-600">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-gray-900">{value}</p>
        </div>
      </div>
    ) : null;

  const VisitCard: React.FC<{ visit: Appointment }> = ({ visit }) => {
    const badge =
      visit.status === 'Completed'
        ? 'bg-green-100 text-green-800'
        : visit.status === 'Scheduled'
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-red-100 text-red-800';

    return (
      <article className="rounded-lg bg-white p-5 shadow transition-shadow hover:shadow-md">
        <header className="mb-2 flex items-start justify-between">
          <h4 className="text-lg font-semibold text-gray-800">{visit.title}</h4>
          <span className={`rounded-full px-2 py-1 text-xs ${badge}`}>
            {visit.status}
          </span>
        </header>

        <p className="mb-3 flex items-center gap-1 text-sm text-gray-500">
          <CalIcon className="inline" />
          {format(parseISO(visit.appointmentDate), 'PPPp')}
        </p>

        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
          {visit.cost !== undefined && (
            <div className="rounded-lg bg-blue-50 p-3">
              <p className="text-xs font-medium text-blue-600">COST</p>
              <p className="text-lg font-semibold">₹{visit.cost}</p>
            </div>
          )}

          {visit.treatment && (
            <div className="rounded-lg bg-green-50 p-3">
              <p className="text-xs font-medium text-green-600">TREATMENT</p>
              <p className="font-medium">{visit.treatment}</p>
            </div>
          )}
        </div>

        {visit.description && (
          <section className="mt-3">
            <p className="text-sm font-medium text-gray-700">Description:</p>
            <p className="text-gray-600">{visit.description}</p>
          </section>
        )}

        {visit.files?.length ? (
          <section className="mt-4">
            <p className="mb-2 text-sm font-medium text-gray-700">Documents:</p>
            <div className="grid grid-cols-2 gap-2">
              {visit.files.map(
                (file: { name: string; url: string }, idx: number) => (
                  <a
                    key={idx}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded border p-2 hover:bg-gray-50"
                  >
                    <FileIcon className="text-indigo-600" />
                    <span className="truncate text-sm">{file.name}</span>
                  </a>
                ),
              )}
            </div>
          </section>
        ) : null}
      </article>
    );
  };

  /* ------------------------------- UI ------------------------------------- */
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* ----------------------------- Sidebar ----------------------------- */}
        <aside className="md:w-1/3">
          <section className="overflow-hidden rounded-xl bg-white shadow-md">
            <header className="bg-indigo-600 p-6 text-white">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <UserIcon /> My Profile
              </h2>
            </header>
            <div className="space-y-5 p-6">
              <ProfileField icon={<UserIcon />} label="Full Name" value={me.name} />
              <ProfileField
                icon={<CalIcon />}
                label="Date of Birth"
                value={format(parseISO(me.dob), 'PPP')}
              />
              <ProfileField icon={<GenderIcon />} label="Gender" value={me.gender} />
              <ProfileField icon={<PhoneIcon />} label="Contact" value={me.contact} />
              <ProfileField icon={<MailIcon />} label="Email" value={me.email} />
              <ProfileField icon={<PinIcon />} label="Address" value={me.address} />

              {me.healthInfo && (
                <div className="border-t pt-4">
                  <h3 className="mb-2 text-sm font-medium text-gray-500">
                    HEALTH INFORMATION
                  </h3>
                  <p className="text-gray-700">{me.healthInfo}</p>
                </div>
              )}
            </div>
          </section>

          {/* -------------------- Medical summary -------------------- */}
          <section className="mt-6 rounded-xl bg-white p-6 shadow-md">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <ClinicIcon className="text-indigo-600" />
              Medical Summary
            </h3>
            <MedicalChart visits={myVisits} />
          </section>
        </aside>

        {/* --------------------------- Main content -------------------------- */}
        <main className="md:w-2/3">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-lg bg-gray-100 p-1">
              {['Treatment History', 'Upcoming Visits', 'Documents'].map(label => (
                <Tab
                  key={label}
                  className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium transition-colors ${
                      selected
                        ? 'bg-white text-indigo-700 shadow'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  {label}
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels className="mt-4">
              {/* ------------------- History Tab ------------------- */}
              <Tab.Panel>
                <h3 className="mb-6 text-xl font-bold">My Treatment History</h3>
                {myVisits.length === 0 ? (
                  <EmptyState message="No treatment history found." />
                ) : (
                  <div className="space-y-4">
                    {myVisits.map(v => (
                      <VisitCard key={v.id} visit={v} />
                    ))}
                  </div>
                )}
              </Tab.Panel>

              {/* ------------------- Upcoming Tab ------------------ */}
              <Tab.Panel>
                <h3 className="mb-6 text-xl font-bold">Upcoming Visits</h3>
                {myVisits.filter(v => v.status === 'Scheduled').length === 0 ? (
                  <EmptyState message="No upcoming visits scheduled." />
                ) : (
                  <div className="space-y-4">
                    {myVisits
                      .filter(v => v.status === 'Scheduled')
                      .map(v => (
                        <VisitCard key={v.id} visit={v} />
                      ))}
                  </div>
                )}
              </Tab.Panel>

              {/* ------------------- Documents Tab ----------------- */}
              <Tab.Panel>
                <h3 className="mb-6 text-xl font-bold">My Medical Documents</h3>
                {myVisits.filter(v => v.files.length).length === 0 ? (
                  <EmptyState message="No documents available." />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {myVisits.flatMap(v =>
                      v.files.map(
                        (file: { name: string; url: string }, idx: number) => (
                          <a
                            key={`${v.id}-${idx}`}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-lg bg-white p-4 shadow hover:shadow-md"
                          >
                            <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600">
                              <FileIcon size={20} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                From {v.title} •{' '}
                                {format(parseISO(v.appointmentDate), 'PP')}
                              </p>
                            </div>
                          </a>
                        ),
                      ),
                    )}
                  </div>
                )}
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </main>
      </div>
    </div>
  );
};

/* ----------------------------- Empty‑state box ---------------------------- */
const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="rounded-lg bg-white p-8 text-center shadow">
    <p className="text-gray-500">{message}</p>
  </div>
);

export default PatientView;

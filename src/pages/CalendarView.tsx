import React, { useState, useMemo } from 'react';
import {
  format,
  parse,
  parseISO,
  isToday,
  isTomorrow,
  isAfter,
  isBefore,
  startOfWeek,
  getDay,
} from 'date-fns';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  FiCalendar,
  FiList,
  FiGrid,
} from 'react-icons/fi';
import { useData } from '../context/DataContext';
import type { Appointment } from '../types/types';


const CalendarIcon = FiCalendar as React.ElementType;
const ListIcon     = FiList     as React.ElementType;
const GridIcon     = FiGrid     as React.ElementType;


const locales = { 'en-US': require('date-fns/locale/en-US') };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

/* -------------------------------------------------------------------------- */
const CalendarView: React.FC = () => {
  const { appointments, patients } = useData();


  const [view, setView] = useState<'calendar' | 'list' | 'grid'>('calendar');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'upcoming' | 'past' | 'all'>('upcoming');


  const getPatientName = (id: string) =>
    patients.find(p => p.id === id)?.name ?? 'Unknown Patient';

  const filtered = useMemo(() => {
    return appointments.filter(a => {
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;

      const date = parseISO(a.appointmentDate);
      if (dateRange === 'upcoming' && isBefore(date, new Date())) return false;
      if (dateRange === 'past' && isAfter(date, new Date())) return false;
      return true;
    });
  }, [appointments, statusFilter, dateRange]);

  const events = filtered.map(a => ({
    id: a.id,
    title: `${a.title} – ${getPatientName(a.patientId)}`,
    start: parseISO(a.appointmentDate),
    end:   new Date(parseISO(a.appointmentDate).getTime() + 30 * 60 * 1000),
    status: a.status,
  }));

  const eventStyleGetter = (event: any) => {
    let bg = '#3B82F6'; 
    if (event.status === 'Completed') bg = '#10B981';
    if (event.status === 'Cancelled') bg = '#EF4444';
    if (event.status === 'Scheduled') bg = '#F59E0B';
    if (isToday(event.start)) bg = '#2563EB';

    return {
      style: {
        backgroundColor: bg,
        borderRadius: 4,
        color: '#fff',
        opacity: 0.9,
        display: 'block',
        border: 0,
      },
    };
  };

  
  const renderCard = (a: Appointment) => {
    const patient = patients.find(p => p.id === a.patientId);
    const date = parseISO(a.appointmentDate);

    let when = format(date, 'PPPp');
    if (isToday(date))     when = `Today, ${format(date, 'p')}`;
    else if (isTomorrow(date)) when = `Tomorrow, ${format(date, 'p')}`;

    const badge =
      a.status === 'Completed'
        ? 'bg-green-100 text-green-800'
        : a.status === 'Cancelled'
        ? 'bg-red-100 text-red-800'
        : 'bg-yellow-100 text-yellow-800'; // Scheduled

    return (
      <div
        key={a.id}
        className="rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">{a.title}</h3>
          <span className={`rounded-full px-2 py-1 text-xs ${badge}`}>
            {a.status}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">{when}</p>
        <div className="mt-2 border-t pt-2 text-sm">
          <p className="font-medium text-gray-700">
            Patient: {patient?.name ?? 'Unknown'}
          </p>
          {patient?.contact && (
            <p className="text-gray-600">Contact: {patient.contact}</p>
          )}
        </div>
      </div>
    );
  };

  /* ---------------------------------------------------------------------- */
  return (
    <div className="container mx-auto px-4 py-8">
      {/* ---------- Header ---------- */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Appointment Calendar
        </h2>

        {/* ---------- Controls ---------- */}
        <div className="flex flex-wrap gap-3">
          {/* View toggles */}
          <div className="flex items-center rounded-md bg-white p-1 shadow-sm">
            <button
              onClick={() => setView('calendar')}
              className={`flex items-center px-3 py-1 text-sm ${
                view === 'calendar'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Calendar view"
            >
              <CalendarIcon size={16} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex items-center px-3 py-1 text-sm ${
                view === 'list'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="List view"
            >
              <ListIcon size={16} />
            </button>
            <button
              onClick={() => setView('grid')}
              className={`flex items-center px-3 py-1 text-sm ${
                view === 'grid'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Grid view"
            >
              <GridIcon size={16} />
            </button>
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setStatusFilter(e.target.value)
            }
            className="min-w-[150px] rounded border-gray-300 text-sm shadow-sm focus:ring-indigo-500"
          >
            {['all', 'Scheduled', 'Completed', 'Cancelled'].map(s => (
              <option key={s} value={s}>
                {s === 'all' ? 'All Statuses' : s}
              </option>
            ))}
          </select>

          {/* Date range filter */}
          <select
            value={dateRange}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setDateRange(e.target.value as 'all' | 'upcoming' | 'past')
            }
            className="min-w-[120px] rounded border-gray-300 text-sm shadow-sm focus:ring-indigo-500"
          >
            <option value="all">All Dates</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>
      </div>

      {/* ---------- View: Calendar ---------- */}
      {view === 'calendar' &&
        (events.length === 0 ? (
          <div className="rounded-lg bg-white py-12 text-center shadow">
            <p className="text-gray-500">
              No appointments available on the calendar.
            </p>
          </div>
        ) : (
          <div className="rounded-lg bg-white p-4 shadow">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              views={['month', 'week', 'day', 'agenda']}
              defaultView={Views.WEEK}
              style={{ height: 600 }}
              popup
              eventPropGetter={eventStyleGetter}
            />
          </div>
        ))}

      {/* ---------- View: List ---------- */}
      {view === 'list' &&
        (filtered.length === 0 ? (
          <div className="rounded-lg bg-white py-12 text-center shadow">
            <p className="text-gray-500">
              No appointments found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {[...filtered]
              .sort(
                (a, b) =>
                  new Date(a.appointmentDate).getTime() -
                  new Date(b.appointmentDate).getTime(),
              )
              .map(renderCard)}
          </div>
        ))}

      {/* ---------- View: Grid ---------- */}
      {view === 'grid' &&
        (filtered.length === 0 ? (
          <div className="rounded-lg bg-white py-12 text-center shadow">
            <p className="text-gray-500">
              No appointments found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map(renderCard)}
          </div>
        ))}
    </div>
  );
};

export default CalendarView;

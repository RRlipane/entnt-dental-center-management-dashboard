import React, { useMemo } from 'react';
import {
  format,
  parseISO,
  isToday,
  isThisWeek,
  isAfter,
  getYear,
  getMonth,
} from 'date-fns';
import {
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiCalendar,
  FiStar,
  FiTrendingUp,
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

import { useData } from '../context/DataContext';


const UsersIcon    = FiUsers       as React.ElementType;
const CheckIcon    = FiCheckCircle as React.ElementType;
const ClockIcon    = FiClock       as React.ElementType;
const DollarIcon   = FiDollarSign  as React.ElementType;
const CalendarIcon = FiCalendar    as React.ElementType;
const StarIcon     = FiStar        as React.ElementType;
const TrendIcon    = FiTrendingUp  as React.ElementType;

/* -------------------------------------------------------------------------- */
const currentYear   = getYear(new Date());
const monthLabel    = (m: number) => format(new Date(currentYear, m, 1), 'MMM');
/* -------------------------------------------------------------------------- */

const Dashboard: React.FC = () => {
  const { patients, appointments } = useData();

  
  const metrics = useMemo(() => {
    const toNumber = (n: unknown) => Number(n ?? 0);           

    const totalPatients     = patients.length;
    const totalAppointments = appointments.length;

    const completed = appointments.filter(a => a.status === 'Completed').length;
    const scheduled = appointments.filter(a => a.status === 'Scheduled').length;
    const cancelled = appointments.filter(a => a.status === 'Cancelled').length;

    
    const totalRevenue = appointments.reduce(
      (sum, a) => sum + toNumber(a.cost),
      0,
    );

    const completionRate = totalAppointments
      ? Math.round((completed / totalAppointments) * 100)
      : 0;

    
    const revenueByMonth = Array.from({ length: 12 }, (_, m) => {
      const revenue = appointments
        .filter(
          a =>
            !!a.appointmentDate &&
            getYear(parseISO(a.appointmentDate)) === currentYear &&
            getMonth(parseISO(a.appointmentDate)) === m,
        )
        .reduce((sum, a) => sum + toNumber(a.cost), 0);

      return { name: monthLabel(m), revenue };
    });

    /* ---- STATUS DATA ---------------------------------------------------- */
    const statusData = [
      { name: 'Completed', value: completed, color: '#10B981' },
      { name: 'Scheduled', value: scheduled, color: '#F59E0B' },
      { name: 'Cancelled', value: cancelled, color: '#EF4444' },
    ];

    /* ---- TODAY / UPCOMING ---------------------------------------------- */
    const today = appointments
      .filter(a => a.appointmentDate && isToday(parseISO(a.appointmentDate)))
      .sort((a, b) => (a.appointmentDate ?? '').localeCompare(b.appointmentDate ?? ''));

    const upcoming = appointments
      .filter(a => {
        if (!a.appointmentDate) return false;
        const d = parseISO(a.appointmentDate);
        return isAfter(d, new Date()) && isThisWeek(d, { weekStartsOn: 1 });
      })
      .sort((a, b) => (a.appointmentDate ?? '').localeCompare(b.appointmentDate ?? ''))
      .slice(0, 5);

    /* ---- TOP PATIENTS BY SPEND ------- */
    const topPatients = patients
      .map(p => {
        const visits = appointments.filter(a => a.patientId === p.id);
        return {
          ...p,
          visitCount: visits.length,
          totalSpent: visits.reduce((s, a) => s + toNumber(a.cost), 0),
        };
      })
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    return {
      totalPatients,
      totalAppointments,
      totalRevenue,
      completed,
      scheduled,
      cancelled,
      completionRate,
      revenueByMonth,
      statusData,
      today,
      upcoming,
      topPatients,
    };
  }, [patients, appointments]);


  const getPatientName = (id: string) =>
    patients.find(p => p.id === id)?.name ?? 'Unknown';

  /* -------------- UI ------------------------------------- */
  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
        Dashboard Overview
      </h1>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<UsersIcon className="text-blue-500" size={24} />}
          title="Total Patients"
          value={metrics.totalPatients}
        />
        <MetricCard
          icon={<CheckIcon className="text-green-500" size={24} />}
          title="Completed"
          value={metrics.completed}
          percentage={metrics.completionRate}
        />
        <MetricCard
          icon={<ClockIcon className="text-yellow-500" size={24} />}
          title="Scheduled"
          value={metrics.scheduled}
          trend={metrics.scheduled > 5 ? 'up' : 'down'}
        />
        <MetricCard
          icon={<DollarIcon className="text-purple-500" size={24} />}
          title="Total Revenue"
          value={`₹${metrics.totalRevenue.toLocaleString()}`}
          description="Current year"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly revenue */}
        <ChartCard
          title="Monthly Revenue"
          icon={<TrendIcon className="mr-2 text-blue-500" />}
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={metrics.revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={v => `₹${(v / 1000).toLocaleString()}k`}
              />
              <Tooltip
                formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Status distribution */}
        <ChartCard
          title="Appointment Status"
          icon={<CalendarIcon className="mr-2 text-green-500" />}
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={metrics.statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {metrics.statusData.map(d => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Bottom lists */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ListCard
          title="Today's Appointments"
          icon={<CalendarIcon className="mr-2 text-blue-500" />}
          empty="No appointments today"
        >
          {metrics.today.map(a => (
            <ListRow
              key={a.id}
              primary={a.title}
              secondary={getPatientName(a.patientId)}
              right={format(parseISO(a.appointmentDate), 'h:mm a')}
              badge={a.status}
            />
          ))}
        </ListCard>

        <ListCard
          title="Upcoming This Week"
          icon={<ClockIcon className="mr-2 text-yellow-500" />}
          empty="No upcoming appointments"
        >
          {metrics.upcoming.map(a => (
            <ListRow
              key={a.id}
              primary={a.title}
              secondary={getPatientName(a.patientId)}
              right={format(parseISO(a.appointmentDate), 'EEE, MMM d')}
            />
          ))}
        </ListCard>

        <ListCard
          title="Top Patients"
          icon={<StarIcon className="mr-2 text-purple-500" />}
          empty="No patient data"
        >
          {metrics.topPatients.map(p => (
            <ListRow
              key={p.id}
              primary={p.name}
              secondary={p.contact}
              right={`₹${p.totalSpent.toLocaleString()}`}
              small={`${p.visitCount} visits`}
            />
          ))}
        </ListCard>
      </div>
    </div>
  );
};


interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  percentage?: number;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
}
const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  title,
  value,
  percentage,
  trend,
  description,
}) => (
  <div className="rounded-lg bg-white p-4 shadow">
    <div className="flex justify-between">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 bg-opacity-50">
        {icon}
      </div>

      {/* Percentage badge */}
      {percentage !== undefined && (
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            percentage > 75
              ? 'bg-green-100 text-green-800'
              : percentage > 50
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {percentage}%
        </span>
      )}

      {/* Trend badge */}
      {trend && trend !== 'neutral' && (
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            trend === 'up'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {trend === 'up' ? '↑' : '↓'}
        </span>
      )}
    </div>

    <h3 className="mt-2 text-sm font-medium text-gray-500">{title}</h3>
    <p className="mt-1 text-2xl font-bold">{value}</p>
    {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
  </div>
);

interface ChartCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}
const ChartCard: React.FC<ChartCardProps> = ({ title, icon, children }) => (
  <div className="rounded-lg bg-white p-4 shadow">
    <h3 className="mb-4 flex items-center text-lg font-semibold">
      {icon}
      {title}
    </h3>
    <div className="h-64">{children}</div>
  </div>
);

interface ListCardProps {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  empty: string;
}
const ListCard: React.FC<ListCardProps> = ({
  title,
  icon,
  children,
  empty,
}) => (
  <div className="rounded-lg bg-white p-4 shadow">
    <h3 className="mb-3 flex items-center text-lg font-semibold">
      {icon}
      {title}
    </h3>
    {React.Children.count(children) === 0 ? (
      <p className="py-4 text-center text-gray-500">{empty}</p>
    ) : (
      <ul className="space-y-3">{children}</ul>
    )}
  </div>
);

interface ListRowProps {
  primary: string;
  secondary?: string;
  right: string;
  badge?: string;
  small?: string;
}
const ListRow: React.FC<ListRowProps> = ({
  primary,
  secondary,
  right,
  badge,
  small,
}) => {
  const badgeColor =
    badge === 'Completed'
      ? 'bg-green-100 text-green-800'
      : badge === 'Scheduled'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-red-100 text-red-800';

  return (
    <li className="flex items-center justify-between rounded p-2 hover:bg-gray-50">
      <div>
        <p className="font-medium">{primary}</p>
        {secondary && <p className="text-sm text-gray-600">{secondary}</p>}
        {small && <p className="text-xs text-gray-400">{small}</p>}
      </div>
      <div className="text-right">
        <p className="text-sm font-medium">{right}</p>
        {badge && (
          <span
            className={`mt-1 block rounded-full px-2 py-0.5 text-xs ${badgeColor}`}
          >
            {badge}
          </span>
        )}
      </div>
    </li>
  );
};

export default Dashboard;

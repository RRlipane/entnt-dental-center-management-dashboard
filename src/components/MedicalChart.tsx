import React from 'react';
import { Appointment } from '../types/types';

export const MedicalChart: React.FC<{ visits: Appointment[] }> = ({
  visits,
}) => (
  <div className="rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">
    {visits.length
      ? `${visits.length} visit(s) on record — chart coming soon`
      : 'No visits yet'}
  </div>
);


export interface Appointment {
  id: string;
  fullName: string;
  appointmentDate: Date | null;
  appointmentTime: string;
  purpose: string;
  status: string;
  createdAt: Date | null;
}

export type NewAppointment = Pick<Appointment,
  'fullName' | 'appointmentDate' | 'appointmentTime' | 'purpose'>;

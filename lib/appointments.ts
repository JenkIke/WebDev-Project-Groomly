type Appointment = {
  id: number;
  clientFirstName: string;
  clientLastName: string;
  phoneNum: string;
  dogName: string;
  breed: string;
  notes: string;
  service: string;
  startDate: Date;
  endDate: Date;
};

export const appointments: Appointment[] =  [
  {id: 1,
    clientFirstName: "Evgeny",
    clientLastName: "Kutepov",
    phoneNum: "587-998-0020",
    dogName: "Bailey",
    breed:"Bull Terrier",
    notes:"Nervous around dryer",
    service:"bath and trim",
    startDate: new Date(2026, 10, 27, 10, 0),
    endDate: new Date(2026, 10, 27, 11, 30),
  },
];

export function getAppointmentsForDay(day: Date): Appointment[] {
  return appointments
  .filter((a) => a.startDate.toDateString() === day.toDateString())
  .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}
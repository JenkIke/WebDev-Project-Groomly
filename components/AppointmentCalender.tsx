"use client";

import { useState } from "react";
import { Calendar} from "@/components/ui/calendar";
import { enUS } from "date-fns/locale";

const appointments = [
  {id: 1, dog: "Bella", service: "Bath and trim", date: new Date(2026, 10, 27, 10, 0)},
  {id: 2, dog: "Max", service: "Nail clipping", date: new Date(2026, 10, 27, 14, 30)},
  {id: 3, dog: "Luna", service: "Full groom", date: new Date(2026, 11, 2, 9, 0)},
]

const AppointmentCalender = () => {
  const [selected, setSelected] = useState<Date | undefined>();

  const now = new Date()
  const shown = appointments.filter((a) => selected ? 
  a.date.toDateString() === selected.toDateString() : a.date >= now)
  
  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <Calendar
        mode="single"
        selected={selected}
        onSelect={setSelected}
        modifiers={{booked: appointments.map((a) => a.date)}}
        modifiersClassNames={{booked: "font-bold underline"}}
        locale={enUS}
        className="self-start rounded-lg border" />

        <div>
          <h3 className="mb-2 font-semibold">
            {selected ? selected.toDateString() : "Upcoming appointments"}
          </h3>
          {shown.length === 0 && <p>No appointments.</p>}
          <ul className="space-y-2">
            {shown.map((a) => (
              <li key={a.id} className="rounded-lg border p-3">
                <p className="font-medium">{a.dog}: {a.service}</p>
                <p className="text-sm text-muted-foreground">{a.date.toLocaleString("en-US")}</p>
              </li>
            ))}
          </ul>
        </div>
    </div>
  )
}

export default AppointmentCalender;
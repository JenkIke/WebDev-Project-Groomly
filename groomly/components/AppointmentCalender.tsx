"use client";

import { useState } from "react";
import { Calendar} from "@/components/ui/calendar";
import { CalendarRange } from "lucide-react";

const appointments = [
  {id: 1, dog: "Bella", service: "Bath and trim", date: new Date(2026, 10, 27, 10, 0)},
  {id: 2, dog: "Max", service: "Nail clipping", date: new Date(2026, 10, 27, 14, 30)},
  {id: 3, dog: "Luna", service: "Full groom", date: new Date(2026, 11, 2, 9, 0)},
]

const appointmentCalender = () => {
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
        modifiers={{booked: appointments}}
    </div>
  )
}
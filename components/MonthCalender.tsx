"use client";

import { useState } from "react";
import {addMonths, format, subMonths, getDay, getDaysInMonth, startOfMonth} from "date-fns";
import {Button} from "@/components/ui/button";

const MonthCalender = () => {

  const [month, setMonth] = useState(() => new Date());

  const blankBox = getDay(startOfMonth(month));
  const days = Array.from(
    { length: getDaysInMonth(month)},
    (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1),
  );

  return(
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {format(month, "MMMM yyyy")}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setMonth((m) => subMonths(m, 1))}>
            Previous
          </Button>
          <Button variant="outline" onClick={() => setMonth(new Date())}>
            Today
          </Button>
          <Button variant="outline" onClick={() => setMonth((m) => addMonths(m, 1))}>
            Next
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((name) => (
          <div key={name} className="p-2 font-semibold">{name}</div>
        ))}
        {Array.from({length: blankBox}, (_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {days.map((day) => (
          <div key={day.getDate()} className="h-24 border p-2">{day.getDate()}</div>
        ))}
      </div>
    </div>
  );
};

export default MonthCalender;
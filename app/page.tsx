import { Suspense } from "react";
import AppointmentCalender from "@/components/AppointmentCalender";
const Home = () => {
  return (
    <main className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <Suspense fallback={<p>Loading calender...</p>}>
        <AppointmentCalender/>
      </Suspense>
    </main>
  )
};


export default Home;
"use client";

import { CalendarUI, CardStatusLegendLesson } from "@/components";

export default function DashboardPage() {
  return (
    <>
      <section className="mb-4">
        <CardStatusLegendLesson rol="admin" />
      </section>

      <CalendarUI rol="admin" />
    </>
  );
}

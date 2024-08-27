"use client";

import { CalendarUI } from "@/components";

export default function DashboardPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Welcome to the Admin Dashboard</h1>

      <CalendarUI rol="admin" />
    </>
  );
}

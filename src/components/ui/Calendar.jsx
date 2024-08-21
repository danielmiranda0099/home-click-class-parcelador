'use client'
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'
 
export function CalendarUI({events=[]}) {
  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    plugins: [],
    callbacks: {
      onEventClick(calendarEvent) {
        console.log('onEventClick', calendarEvent)
      },
    },
    events: events 
  })
 
  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar}/>
    </div>
  )
}
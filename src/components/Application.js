import React from "react";

import DayList from "components/DayList";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

import useApplicationData from "hooks/useApplicationData";

import "components/Application.scss";

export default function Application(props) {
  const { state, setDay, bookInterview, cancelInterview } = useApplicationData();

  // Get a list of all interviewers for selected day
  const dailyInterviewers = getInterviewersForDay(state, state.day); 

  // Get a list of all appointments for selected day
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  
  // Iterate through the appointments list to generate Appointment component for each one
  const appointmentList = dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interviewers={dailyInterviewers} // Same interviewers for each daily appointment
        interview={interview}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        {/* Sidebar elements during the "Project Setup & Familiarity" activity. */}
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          < DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {/* Schedule elements */}
        {appointmentList}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}

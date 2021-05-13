import React, { useState, useEffect } from "react";
import axios from "axios";

import DayList from "components/DayList";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

import "components/Application.scss";

export default function Application(props) {
  // Combined state object
  const [state, setState] = useState({
    day: "Monday",    // Currently selected day
    days: [],         // [{}, {}, {}...] Days state to store an array of days (used for the sidebar)
    appointments: {}, // {{}, {}, {}...}
    interviewers: {}  // {{}, {}, {}...}
  });

  // Function that updates the state with all of the existing keys of state and the new day (replaces existing day)
  const setDay = day => setState({ ...state, day });

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
      />
    );
  });

  // console.log('Testing state:', state);

  /* 
   * Empty array dependency because we only want this request to run once after the component renders for the first time.
   * To never rerun this effect, we have to pass it an empty dependency array.
   */
  useEffect(() => {
    /*
     * Make multiple requests at the same time before updating the state because of dependent data
     * Promise.all runs many promises concurrently and when all the Promises resolve, update the state
     * Promise.all will resolve to an array of resolved values matching the order of the array passed in
     * Data dependency: can't list appointments until getting the days data, followed by the appointments data
     */
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      const [ daysResponse, appointmentsResponse, interviewersData ] = all;
      const days = daysResponse.data;                 // Structure: [{}, {}, {}...]
      const appointments = appointmentsResponse.data; // Structure: {{}, {}, {}...}
      const interviewers = interviewersData.data;     // Structure: {{}, {}, {}...}

      setState(prev => ({ ...prev, days, appointments, interviewers })); // Update state after all requests are complete
    }).catch((error) => {
      console.log("Error: ", error);
    });
  }, [])

  
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

import React, { useState, useEffect } from "react";

import axios from "axios";

import DayList from "components/DayList";
import Appointment from "components/Appointment";

import "components/Application.scss";

export default function Application(props) {
  // Combined state object
  const [state, setState] = useState({
    day: "Monday",  // Track the currently selected day
    days: [],       // Days state to store an array of days used for the sidebar
    // you may put the line below, but will have to remove/comment hardcoded appointments variable
    appointments: {}
  });

  // Holds a list of appointments for that day
  const dailyAppointments = [];

  // Function that updates the state with all of the existing keys of state and the new day (replaces existing day)
  const setDay = day => setState({ ...state, day });
  const setDays = days => setState(prev => ({ ...prev, days })); // setState({ ...state, days }) gives warning b/c we are referring to state in the effect method, but we haven't declared it in the dependency list.


  /* 
   * useEffect for a GET request to /api/days using axios and update the days state with the response
   * Empty array dependency because we only want this request to run once after the component renders for the first time.
   * To never rerun this effect, we have to pass it an empty dependency array.
   */
  useEffect(() => {
    axios.get('/api/days')
      .then((response) => {
        setDays([...response.data]);
      })
      .catch((error) => console.log("Error: ", error));
  }, [])

  // Apointment list
  const appointmentList = dailyAppointments.map((appointment) => {
    return <Appointment key={appointment.id} {...appointment} />
  })

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

import React, { useState, useEffect } from "react";

import axios from "axios";

import DayList from "components/DayList";
import Appointment from "components/Appointment";

import "components/Application.scss";

// Mock Data
const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  { 
    id: 3,
    time: "2pm",
  },
  { id: 4,
    time: "3pm",
    interview: {
      student: "Archie Cohen",
      interviewer: {
        id: 2, 
        name: "Tori Malcolm", 
        avatar: "https://i.imgur.com/Nmx0Qxo.png",
      }
    }
  },
  { id: 5,
    time: "4pm",
    interview: {
      student: "Maria Boucher",
      interviewer: {
        id: 3, 
        name: "Mildred Nazir", 
        avatar: "https://i.imgur.com/T2WwVfS.png"
      }
    }
  }
];

export default function Application(props) {
  const [ day, setDay ] = useState("Monday");   // Track the currently selected day
  const [ days, setDays ] = useState([]);       // Days state to store an array of days used for the sidebar

  /* 
   * useEffect for a GET request to /api/days using axios and update the days state with the response
   * Empty array dependency because we only want this request to run once after the component renders for the first time.
   * To never rerun this effect, we have to pass it an empty dependency array.
   */
  useEffect(() => {
    axios.get('/api/days')
      .then((response) => {
        console.log([response.data]);
        console.log([...response.data]);
        setDays([...response.data]);
      })
      .catch((error) => console.log("Error: ", error));
  }, [])

  // Apointment list
  const appointmentList = appointments.map((appointment) => {
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
            days={days}
            day={day}
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

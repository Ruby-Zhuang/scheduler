import { useState, useEffect } from "react";
import axios from "axios";

/*
 * Custom Hook to provide the state and actions used to change the state. 
 * Responsible for loading the initial data from the API, and when any of the provided actions are called the state updates, causing the component to render.
 * Custom Hook owns the data management
 */
const useApplicationData = function() {
  // Combined state object
  const [state, setState] = useState({
    day: "Monday",    // Currently selected day
    days: [],         // [{}, {}, {}...] Days state to store an array of days (used for the sidebar)
    appointments: {}, // {{}, {}, {}...}
    interviewers: {}  // {{}, {}, {}...}
  });

  // Function that updates the state with all of the existing keys of state and the new day (replaces existing day)
  const setDay = day => setState({ ...state, day });

  // Function to update the number of spots remaining for a given day and returns a days array with the updated day
  function updateDays(days, updatedAppointments, updatedAppointmentId) {
    // Function that finds the number of spots remaining for a given day
    const getSpotsRemaining = (day) => {
      const spotsRemaining = day.appointments.reduce((emptySpots, appointmentId) => {
        if (updatedAppointments[appointmentId].interview === null) emptySpots++;
        return emptySpots;
      }, 0);

      return spotsRemaining;
    }

    // Iterate over days array and creates a copy of each day
    const newDays = days.map((day) => {
      // Updates the spots remaining for the day that has the updated interview
      return day.appointments.includes(updatedAppointmentId) ? {...day, spots: getSpotsRemaining(day)} : day
    })

    return newDays;
  }

  // Function adds an appointment/interview by making an HTTP request and updating the local state.
  function bookInterview(id, interview) {
    // Immutable update pattern to update interview -> appointment -> appointments
    const appointment = { ...state.appointments[id], interview: { ...interview }};
    const appointments = { ...state.appointments, [id]: appointment };
    
    // Update days with the new day and updated spots remaining 
    const days = updateDays(state.days, appointments, id);

    // Need to return promise so that Appointment component can transition to next MODE when it resolves
    return axios.put(`/api/appointments/${id}`, {interview})
      .then(() => setState({...state, appointments, days}));
  }
  
  // Function to delete an appointment/interview by making an HTTP request and updating the local state.
  function cancelInterview(id) {
    // Immutable update pattern to update interview -> appointment -> appointments
    const appointment = { ...state.appointments[id], interview: null };
    const appointments = { ...state.appointments, [id]: appointment };

    // Update days with the new day and updated spots remaining 
    const days = updateDays(state.days, appointments, id);

    // Need to return promise so that Appointment component can transition to next MODE when it resolves
    return axios.delete(`/api/appointments/${id}`)
      .then(() => setState({...state, appointments, days}));
  }

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

  return { state, setDay, bookInterview, cancelInterview }
}

export default useApplicationData;

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


  function getSpotsRemaining(state, updatedAppointments, day) {
    const { days } = state; // days [{}, {}, {}...]

    // Find the object in our state.days array who's name matches the provided day
    const dayObjectFound = days.find((dayData) => dayData.name === day);  
  
    // Count the number of empty spots by iterating over the array of appointment IDs
    const appointmentIds = dayObjectFound.appointments;
    const spotsRemaining = appointmentIds.reduce((emptySpots, appointmentId) => {
      if (updatedAppointments[appointmentId].interview === null) emptySpots++;
      return emptySpots;
    }, 0);

    console.log(day, spotsRemaining);

  }



  // Function adds an appointment/interview by making an HTTP request and updating the local state.
  function bookInterview(id, interview) {
    // console.log(id, interview);
    
    // Immutable update pattern to update interview -> appointment -> appointments -> state
    const appointment = {
      ...state.appointments[id],  // 2. Copy appointment object & replace with copied interview object
      interview: { ...interview } // 1. Copy interview object
    };
    const appointments = {
      ...state.appointments,      // 3. Copy apppointments ojbect & replace specific copied appointment object
      [id]: appointment
    };
    
    getSpotsRemaining(state, appointments, state.day);

    return axios.put(`/api/appointments/${id}`, {interview})
      .then(() => setState({...state, appointments}));
  }
  
  // Function to delete an appointment/interview by making an HTTP request and updating the local state.
  function cancelInterview(id) {
    // console.log(id);

    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`)
      .then(() => setState({...state, appointments}));
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

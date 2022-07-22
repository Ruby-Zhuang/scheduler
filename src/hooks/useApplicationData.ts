import { useReducer, useEffect } from 'react';
import axios from 'axios';

/**
 * Update days array of objects with the number of spots remaining for a given day
 * @param {[{}]} days An array of day objects.
 * @param {{{}}} updatedAppointments An object of appointment objects.
 * @param {Number} updatedAppointmentId The updated appointment id.
 * @return {[{}]} An updated array of day objects.
 */
function updateDays(days, updatedAppointments, updatedAppointmentId) {
  // Function that finds the number of spots remaining for a given day
  const getSpotsRemaining = (day) => {
    const appointmentIds = day.appointments;
    const spotsRemaining = appointmentIds.filter(
      (appointmentId) => updatedAppointments[appointmentId].interview === null
    ).length;

    return spotsRemaining;
  };

  // Iterate over days array and create a copy of each day & update the spots remaining for the day updated
  const newDays = days.map((day) => {
    // Updates the spots remaining for the day that has the updated interview
    const appointmentIds = day.appointments;
    return appointmentIds.includes(updatedAppointmentId)
      ? { ...day, spots: getSpotsRemaining(day) }
      : day;
  });

  return newDays;
}

const SET_DAY = 'SET_DAY';

function reducer(state: ApplicationData, action: any): ApplicationData {
  if (action.type === SET_DAY) {
    return {
      ...state,
      day: action.day,
    };
  }

  if (action.type === 'SET_DATA') {
    return {
      ...state,
      days: action.days,
      appointments: action.appointments,
      interviewers: action.interviewers,
    };
  }

  if (action.type === 'SET_INTERVIEW') {
    // Immutable update pattern to update interview -> appointment -> appointments
    const appointment = {
      ...state.appointments[action.id],
      interview: action.interview && { ...action.interview },
    };
    const appointments = { ...state.appointments, [action.id]: appointment };

    // Update days with the new day and updated spots remaining
    const days = updateDays(state.days, appointments, action.id);

    return { ...state, days, appointments };
  }

  return state;
}

export interface ApplicationData {
  day: WeekDay;
  days: Day[];
  appointments: Record<number, Appointment>;
  interviewers: Record<number, Interviewer>;
}

/*
 * Custom Hook to provide the state and actions used to change the state.
 * Responsible for loading the initial data from the API, and when any of the provided actions are called the state updates, causing the component to render.
 * Hook owns the data management
 */
const useApplicationData = function () {
  // Combined state object
  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday', // Currently selected day
    days: [], // [{}, {}, {}...] Days state to store an array of days (used for the sidebar)
    appointments: {}, // {{}, {}, {}...}
    interviewers: {}, // {{}, {}, {}...}
  });

  // Function that updates the state with all of the existing keys of state and the new day (replaces existing day)
  const setDay = (day: WeekDay) => dispatch({ type: SET_DAY, day });

  /**
   * Adds an appointment/interview by making an HTTP request and updating the local state.
   * @param {Number} id The appointment id.
   * @param {{student, interviewer}} interview An object containing the interview data.
   * @return {Promise<>} A promise.
   */
  function bookInterview(id, interview) {
    // Need to return promise so that Appointment component can transition to next MODE when it resolves
    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then(() => dispatch({ type: 'SET_INTERVIEW', id, interview }));
  }

  /**
   * Delete an appointment/interview by making an HTTP request and updating the local state.
   * @param {Number} id The appointment id.
   * @return {Promise<>} A promise.
   */
  function cancelInterview(id) {
    // Need to return promise so that Appointment component can transition to next MODE when it resolves
    return axios
      .delete(`/api/appointments/${id}`)
      .then(() => dispatch({ type: 'SET_INTERVIEW', id, interview: null }));
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
      axios.get('/api/interviewers'),
    ])
      .then((all) => {
        const [daysResponse, appointmentsResponse, interviewersData] = all;
        const days = daysResponse.data;
        const appointments = appointmentsResponse.data;
        const interviewers = interviewersData.data;

        dispatch({ type: 'SET_DATA', days, appointments, interviewers }); // Update state after all requests are complete
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  }, []);

  return { state, setDay, bookInterview, cancelInterview };
};

export default useApplicationData;

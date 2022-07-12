import type { ApplicationData } from 'hooks/useApplicationData';

/**
 * Get all appointments for a given day.
 * @param {day, days:[{}], appointments:{{}}, interviewers:{{}}} state An object containing state values.
 * @param {String} day The selected day.
 * @return {[{}]}  An array of appointment objects. Empty array if nothing found.
 */
export function getAppointmentsForDay(state: ApplicationData, day: WeekDay) {
  const { days, appointments } = state;

  // Find the object in our state.days array who's name matches the provided day
  const dayObjectFound = days.find((dayData) => dayData.name === day);

  // Returns an empty array when: the day is not found/the days data is empty || no appointments for the day
  if (!dayObjectFound || dayObjectFound.appointments.length === 0) return [];

  // Iterate over appointmentIds array and for each id, return the corresponding appointment object from state.appointments
  const appointmentIds = dayObjectFound.appointments;
  const dailyAppointments = appointmentIds.map(
    (appointmentId) => appointments[appointmentId]
  );

  return dailyAppointments;
}

/**
 * Get interview object with interviewer data for a given interview object that contains the interviewer id.
 * @param {day, days:[{}], appointments:{{}}, interviewers:{{}}} state An object containing state values.
 * @param {{student, interviewer}} interview The interview object with interviewer as an id.
 * @return {{student, interviewer:{}}}  An object containing the full interviewer data.
 */
export function getInterview(state, interview) {
  const { interviewers } = state;

  if (!interview) return null; // Return null if no interview booked

  const interviewerId = interview.interviewer;
  const interviewerData = interviewers[interviewerId];
  const interviewData = { ...interview, interviewer: interviewerData }; // Will only be keeping the student portion

  return interviewData;
}

/**
 * Get all interviewers for a given day.
 * @param {day, days:[{}], appointments:{{}}, interviewers:{{}}} state An object containing state values.
 * @param {String} day The selected day.
 * @return {[{}]}  An array of interviewer objects. Empty array if nothing found.
 */
export function getInterviewersForDay(state, day) {
  const { days, interviewers } = state; // days [{}, {}, {}...] and appointments {{}, {}, {}...}

  // Find the object in our state.days array who's name matches the provided day
  const dayObjectFound = days.find((dayData) => dayData.name === day);

  // Returns an empty array when: the day is not found/the days data is empty || no interviewers for the day
  if (!dayObjectFound || dayObjectFound.interviewers.length === 0) return [];

  // Iterate over interviewerIds array and for each id, return the corresponding interview object from state.interviewers
  const interviewerIds = dayObjectFound.interviewers;
  const dailyInterviewers = interviewerIds.map(
    (interviewerId) => interviewers[interviewerId]
  );

  return dailyInterviewers;
}

// RETURNS AN ARRAY OF APPOINTMENTS FOR THAT DAY (EMPTY ARRAY IF NOTHING FOUND)
export function getAppointmentsForDay(state, day) {
  const { days, appointments } = state; // days [{}, {}, {}...] and appointments {{}, {}, {}...}

  // Find the object in our state.days array who's name matches the provided day
  const dayObjectFound = days.find((dayData) => dayData.name === day);

  // Returns an empty array when: the day is not found/the days data is empty || no appointments for the day
  if (!dayObjectFound || dayObjectFound.appointments.length === 0) return [];

  // Iterate over appointmentIds array and for each id, return the corresponding appointment object from state.appointments
  const appointmentIds = dayObjectFound.appointments;
  const dailyAppointments = appointmentIds.map((appointmentId) => appointments[appointmentId]);

  return dailyAppointments;
}

// RETURNS A NEW OBJECT CONTAINING THE INTERVIEW DATA WHEN WE PASS IT AN OBJECT THAT CONTAINS THE INTERVIEWER. 
export function getInterview(state, interview) {
  const { interviewers } = state;

  // Return null if no interview booked
  if (!interview) return null;

  console.log(interviewers);

  const interviewerId = interview.interviewer;
  const interviewerData = interviewers[interviewerId]; // Is this a shallow copy?

  // interviewerData.name = "Changed";
  // console.log("changing interviewData");
  // console.log("checking copy:", interviewers);

  const interviewData = {...interview, interviewer: interviewerData}
  
  return interviewData; // { student, interviewer:{} }
}
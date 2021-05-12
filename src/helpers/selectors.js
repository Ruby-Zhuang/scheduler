// Returns an array of appointments for that day
export function getAppointmentsForDay(state, day) {
  // Destructure state to: days [{}, {}, {}...] and appointments {{}, {}, {}...}
  const { days, appointments } = state; 

  // Find the object in our state.days array who's name matches the provided day
  const specificDayOjbect = days.find((dayData) => dayData.name === day);

  // Returns an empty array when the day is not found or when the days data is empty
  if (!specificDayOjbect) {
    return [];
  }

  // Appointment array of ids for the given day if the day exists
  const appointmentsForDay = specificDayOjbect.appointments;

  // Iterate over appointment array and for each id, return the corresponding appointment object from state.appointments
  const result = appointmentsForDay.map((appointmentId) => appointments[appointmentId]);

  // Return array of appointment objects, will be [] if there are no appointments for a specific day
  return result;
}
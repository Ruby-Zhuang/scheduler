import React from 'react';

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  prettyDOM,
  getByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
} from '@testing-library/react';

import Application from 'components/Application';

import axios from 'axios';

afterEach(cleanup);

describe('Application', () => {
  it('defaults to Monday and changes the schedule when a new day is selected', () => {
    const { getByText } = render(<Application />);

    // waitForElement function returns a promise that resolves when the callback returns a truthy value and rejects after a time out when it cannot find the specified text
    // When we return a Promise from the test function, the Jest framework knows that the test isn't complete until the promise chain has resolved or rejected.
    return waitForElement(() => getByText('Monday')).then(() => {
      fireEvent.click(getByText('Tuesday'));
      expect(getByText('Leopold Silvers')).toBeInTheDocument();
    });
  });

  // BOOKING AN INTERVIEW
  it('loads data, books an interview and reduces the spots remaining for Monday by 1', async () => {
    // 1. Render the Application
    /* Container represents the DOM tree that we are working with, and we can pass it to any of the imported queries. */
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // 3. Click the "Add" button on the first empty appointment
    /* Search for all of the appointments in the container and access the first one */
    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments[0];
    fireEvent.click(getByAltText(appointment, 'Add'));

    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lydia Miller-Jones' },
    });

    // 5. Click the first interviewer in the list
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));

    // 6. Click the "Save" button on that same appointment
    fireEvent.click(getByText(appointment, 'Save'));

    // 7. Check that the element with the text "Saving" is displayed
    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    // 8. Wait until the element with the text "Lydia Miller-Jones" is displayed
    await waitForElement(() => getByText(appointment, 'Lydia Miller-Jones'));

    // 9. Check that the DayListItem with the text "Monday" also has the text "no spots remaining"
    /* Search for all of the days in the container and find a specific one */
    const day = getAllByTestId(container, 'day').find((day) =>
      queryByText(day, 'Monday')
    );
    expect(getByText(day, 'no spots remaining')).toBeInTheDocument();
  });

  // DELETING AN INTERVIEW
  it('loads data, cancels an interview and increases the spots remaining for Monday by 1', async () => {
    // 1. Render the Application.
    /* Container represents the DOM tree that we are working with, and we can pass it to any of the imported queries. */
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // 3. Click the "Delete" button on the booked appointment.
    /* Search for all of the appointments in the container and find the one that contains "Archie Cohen" */
    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments.find((appointment) =>
      queryByText(appointment, 'Archie Cohen')
    );
    fireEvent.click(getByAltText(appointment, 'Delete'));

    // 4. Check that the confirmation message is shown.
    expect(
      getByText(appointment, 'Are you sure you want to delete?')
    ).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, 'Confirm'));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, 'Deleting')).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, 'Add'));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    /* Search for all of the days in the container and find a specific one (could split this into 2 lines) */
    const day = getAllByTestId(container, 'day').find((day) =>
      queryByText(day, 'Monday')
    );
    expect(getByText(day, '2 spots remaining')).toBeInTheDocument();
  });

  // EDITING AN INTERVIEW
  it('loads data, edits an interview and keeps the spots remaining for Monday the same', async () => {
    // 1. Render the Application
    /* Container represents the DOM tree that we are working with, and we can pass it to any of the imported queries. */
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    // 3. Click the "Edit" button on the booked appointment.
    /* Search for all of the appointments in the container and find the one that contains "Archie Cohen" */
    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments.find((appointment) =>
      queryByText(appointment, 'Archie Cohen')
    );
    fireEvent.click(getByAltText(appointment, 'Edit'));

    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lydia Miller-Jones' },
    });

    // 5. Click the first interviewer in the list (might not need this)
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));

    // 6. Click the "Save" button on that same appointment
    fireEvent.click(getByText(appointment, 'Save'));

    // 7. Check that the element with the text "Saving" is displayed
    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    // 8. Wait until the element with the text "Lydia Miller-Jones" is displayed
    await waitForElement(() => getByText(appointment, 'Lydia Miller-Jones'));

    // 9. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining" (spots remain unchanged)
    /* Search for all of the days in the container and find a specific one */
    const day = getAllByTestId(container, 'day').find((day) =>
      queryByText(day, 'Monday')
    );
    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();
  });

  // ERROR HANDLING: ON SAVE
  it('shows the save error when failing to save an appointment', async () => {
    axios.put.mockRejectedValueOnce();

    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, 'Archie Cohen'));
    const appointment = getAllByTestId(container, 'appointment')[0];

    fireEvent.click(getByAltText(appointment, 'Add'));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: 'Lydia Miller-Jones' },
    });
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
    fireEvent.click(getByText(appointment, 'Save'));
    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    await waitForElement(
      () => getByText(appointment, 'Could not save appointment.') // Why doesn't queryByText work without the period?
    );

    fireEvent.click(getByAltText(appointment, 'Close'));
    expect(getByText(appointment, 'Save')).toBeInTheDocument(); // Back to FORM mode
  });

  // ERROR HANDLING: ON DELETE
  it('shows the delete error when failing to delete an existing appointment', async () => {
    axios.delete.mockRejectedValueOnce();

    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, 'Archie Cohen'));
    const appointment = getAllByTestId(container, 'appointment').find(
      (appointment) => queryByText(appointment, 'Archie Cohen')
    );

    fireEvent.click(getByAltText(appointment, 'Delete'));
    expect(
      getByText(appointment, 'Are you sure you want to delete?')
    ).toBeInTheDocument();
    fireEvent.click(queryByText(appointment, 'Confirm'));
    expect(getByText(appointment, 'Deleting')).toBeInTheDocument();

    await waitForElement(() =>
      getByText(appointment, 'Could not delete appointment.')
    );

    fireEvent.click(getByAltText(appointment, 'Close'));
    expect(getByAltText(appointment, 'Delete')).toBeInTheDocument(); // Back to SHOW mode
  });
});

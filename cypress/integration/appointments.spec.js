describe('Appointment', () => {
  // COMMON TEST COMMANDS
  beforeEach(() => {
    cy.request('GET', '/api/debug/reset'); // Need to reset database at start of each test
    cy.visit('/');
    cy.contains('Monday');
  });

  // BOOKING AN INTERVIEW
  it('should book an interview', () => {
    // 1. Clicks on the "Add" button in the second appointment
    // Need to use first because there are two Add buttons, we hide the second one because it is part of the last appointment, which we only want to display the header with the time.
    cy.get('[alt=Add]').first().click();

    // 2. Enters their name & chooses an interviewer
    cy.get('[data-testid=student-name-input]').type('Lydia Miller-Jones');
    cy.get('[alt="Sylvia Palmer"]').click();

    // 3. Clicks the save button
    cy.contains('Save').click();

    // 4. Sees the booked appointment
    // Verify that we show the student and interviewer names within and element that has the ".appointment__card--show" class.
    cy.contains('.appointment__card--show', 'Lydia Miller-Jones');
    cy.contains('.appointment__card--show', 'Sylvia Palmer'); // This actually selects the first card because interviewer is the same
  });

  // EDITING AN INTERVIEW
  it('should edit an interview', () => {
    // 1. Clicks the edit button for the existing appointment
    /* The edit button is only revealed when we hover over the appointment. When we try and click on it, it will start "waiting for actionability".
     * We want to use the click arguments to force the action and disable "waiting for actionability".
     */
    cy.get('[alt=Edit]').first().click({ force: true });

    // 2. Changes the name and interviewer
    cy.get('[data-testid=student-name-input]')
      .clear()
      .type('Lydia Miller-Jones');
    cy.get("[alt='Tori Malcolm']").click();

    // 3. Clicks the save button
    cy.contains('Save').click();

    // 4. Sees the edit to the appointment
    cy.contains('.appointment__card--show', 'Lydia Miller-Jones');
    cy.contains('.appointment__card--show', 'Tori Malcolm');
  });

  // CANCELING AN INTERVIEW
  it('should cancel an interview', () => {
    // 1. Clicks the delete button for the existing appointment
    /* The delete button is only revealed when we hover over the appointment. When we try and click on it, it will start "waiting for actionability".
     * We want to use the click arguments to force the action and disable "waiting for actionability".
     */
    cy.get('[alt=Delete]').click({ force: true });

    // 2. Clicks the confirm button
    cy.contains('Confirm').click();

    // 3. Check that the "Deleting" indicator should exist and then should not exist
    cy.contains('Deleting').should('exist');
    cy.contains('Deleting').should('not.exist');

    // 4. Sees that the appointment slot is empty
    cy.contains('.appointment__card--show', 'Archie Cohen').should('not.exist');
  });
});

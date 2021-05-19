describe('Navigation', () => {
  it('should visit root', () => {
    cy.visit('/');
  });

  it('should navigate to Tuesday', () => {
    cy.visit('/');

    // Finds the list item with data-testid attribute, clicks it and checks it for the correct class for a selected item.
    cy.contains('[data-testid=day]', 'Tuesday')
      .click()
      .should('have.class', 'day-list__item--selected');
  });
});

describe('My First Test', () => {
  it('Sanity test', () => {
    cy.visit('/');
    cy.contains('#logo', 'Moments');
  });
});

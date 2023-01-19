describe('Clip', () => {
  it('Should play clip', () => {
    cy.visit('/');
    cy.get('app-clips-list > .grid a:first').click();
    cy.get('app-clip .video-js').click();
    cy.wait(2000);
    cy.get('app-clip .video-js').click();
    cy.get('.vjs-play-progress').invoke('width').should('gte', 0);
  });
});

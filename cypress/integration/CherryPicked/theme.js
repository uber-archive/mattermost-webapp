// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [number] indicates a test step (e.g. 1. Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

/* eslint max-nested-callbacks: ["error", 7] */

describe('Checking the themes', () => {
    before(() => {
        // # Login and navigate to the app
        cy.login('user-1');
        cy.visit('/');
    });

    it('should check the themes', () => {
        // # Open the account settings modal
        cy.toAccountSettingsModal(null, true);

        // # Click on the display option
        cy.get('#displayButton').click();

        // #Ensure that display settings are opened
        cy.get('#displaySettingsTitle').should('exist');

        // # Ensure theme title is visible
        cy.get('#themeTitle').should('be.visible');

        // # Click on theme options
        cy.get('#themeEdit').click();

        // # Ensure uChat light theme is visible and select it
        cy.get('#premadeThemeuChatLight').should('be.visible').click();

        // # Ensure uChat light theme is loaded
        cy.get('#premadeThemeuChatLight').should('have.class', 'active');

        // # Save and close settings modal
        cy.get('#saveSetting').click();
        cy.get('#accountSettingsHeader > .close').click();

        // # Open the account settings modal
        cy.toAccountSettingsModal(null, true);

        // # Click on the display option
        cy.get('#displayButton').click();

        // #Ensure that display settings are opened
        cy.get('#displaySettingsTitle').should('exist');

        // # Ensure theme title is visible
        cy.get('#themeTitle').should('be.visible');

        // Open edit theme
        cy.get('#themeEdit').click();

        // # Ensure uChat dark theme is visible and select it
        cy.get('#premadeThemeuChatDark').should('be.visible').click();

        // # Ensure uChat dark theme is loaded
        cy.get('#premadeThemeuChatDark').should('have.class', 'active');

        // 5. Save and close settings modal
        cy.get('#saveSetting').click();
        cy.get('#accountSettingsHeader > .close').click();
    });
});

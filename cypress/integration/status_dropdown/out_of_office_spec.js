// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [number] indicates a test step (e.g. 1. Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

/*eslint max-nested-callbacks: ["error", 3]*/

describe('Status Dropdown', () => {
    it('Set Out Of Office', () => {
        // 1. Login and navigate to the app
        cy.login('user-1');
        cy.visit('/');

        // 2. Click on status dropdown icon
        cy.get('.status-wrapper.status-selector').click();

        // 3. Check if Out Of Office is in dropdown
        // 4. If not, we are done
        cy.get('.MenuItem').its('length').then((size) => {
            if (size === 5) {
                cy.get('.MenuItem').contains('Out of OfficeAutomatic Replies are enabled').click();
                cy.get('#oooAutoResponderModal').should('be.visible');
                cy.get('#oooAutoResponderTitle').should('be.visible');
                cy.get('#autoResponderMessage').should('be.visible').click();
                cy.get('#autoResponderMessageInput').click().type('{leftarrow}');
                cy.get('#maxCharacterMessage').should('be.visible');
                cy.get('#saveSetting').should('be.visible').should('contain', 'Save');
                cy.get('#cancelSetting').should('be.visible').should('contain', 'Cancel');
                cy.get('#saveSetting').click();
                cy.get('.status-wrapper.status-selector').click();
                cy.get('.MenuItem').eq(0).should('contain', 'Out of OfficeAutomatic Replies are enabled');
                cy.get('.MenuItem').eq(1).click();
                cy.get('#confirmModal').should('be.visible');
                cy.get('#confirmModalButton').click();
            } else {
                cy.get('.MenuItem').eq(0).click();
            }
        });
    });
});

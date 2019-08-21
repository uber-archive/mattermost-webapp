// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [number] indicates a test step (e.g. 1. Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

/* eslint max-nested-callbacks: ["error", 7] */

describe('Info About uChat is rendered', () => {
    before(() => {
        // # Login and navigate to the app
        cy.login('user-1');
        cy.visit('/');
    });
    it('should check whitelabelling changes in about section', () => {
        // # Ensure Channels visible
        cy.get('#channel_view').should('be.visible');

        // # Click on the Sidebar Header Dropdown button
        cy.get('#sidebarHeaderDropdownButton').should('be.visible').click();

        // # Click on About uChat option
        cy.get('#about').should('be.visible').should('contain', 'About uChat').click();

        // # Check Title is correct
        cy.get('#about_title').should('contain', 'About uChat');

        // # Check modal title is correct
        cy.get('#about_modal_title').should('contain', 'uChat');

        // # Check uChat is rendered in version
        cy.get('#about_version').should('contain', 'uChat Version:');

        // # Check copyright message is displayed
        cy.get('#copyright_msg').should('contain', 'Uber Technologies');

        // # Check the greeting is displayed
        cy.get('#about_notice').should('contain', 'Have a great day!');
    });

    // # These tests would fail in localhost since they are specific to staging and production.
    it('would fail locally since they are specific to staging and production', () => {
        // # Ensure the subtitle is displayed
        cy.get('#about_modal_subtitle').should('contain', 'Uber\'s internal, real-time communication platform.');

        // # Check license is displayed
        cy.get('#license_check').should('contain', 'Licensed to: Uber');

        // # Check Terms of Service is displayed and the link is correct
        cy.get('#terms_of_service').should('contain', 'Terms of Service').
            and('have.attr', 'href', 'https://team.uberinternal.com/pages/viewpage.action?pageId=123151892');

        // # Check Privacy Policy is displayed and the link is correct
        cy.get('#privacy_policy').should('contain', 'Privacy Policy').
            and('have.attr', 'href', 'https://team.uberinternal.com/pages/viewpage.action?pageId=123151892');

        // # Ensure the message is displayed and the link is correct
        cy.get('#learn_info').should('contain', 'Learn more about Enterprise Edition at ');
        cy.get('#learn_link').should('contain', 'uchat.uberinternal.com').
            and('have.attr', 'href', 'https://uchat.uberinternal.com/downloads');

        // # Closes the about uChat section
        cy.get('.modal-header > .close').click();
    });
});

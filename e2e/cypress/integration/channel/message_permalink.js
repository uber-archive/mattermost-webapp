// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [number] indicates a test step (e.g. 1. Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

/* eslint max-nested-callbacks: ["error", 7] */

import users from '../../fixtures/users.json';
import * as TIMEOUTS from '../../fixtures/timeouts';

function createNewDMChannel(channelname) {
    cy.get('#addDirectChannel').scrollIntoView().click();

    cy.get('#selectItems').within(() => {
        cy.get('input[type="text"]').scrollIntoView().type(channelname, {force: true});
    });
    cy.contains('.more-modal__description', channelname).click({force: true});
    cy.get('#saveItems').click();
}

describe('Message permalink', () => {
    before(() => {
        // # Login and go to /
        cy.apiLogin('user-1');
        cy.visit('/');
    });

    it('M13675-Copy a permalink and paste into another channel', () => {
        const message = 'Hello' + Date.now();
        const channelName = 'test-message-channel-1';

        // # Create new DM channel with user's email
        createNewDMChannel(users['user-2'].email);

        // # Post message to user
        cy.postMessage(message + '{enter}');
        cy.getLastPostId().then((postId) => {
            // # check if ... button is visible in last post right side
            cy.get(`#CENTER_button_${postId}`).should('not.be.visible');

            // # click on ... button of last post
            cy.clickPostDotMenu(postId);

            // spy on function and verify it
            cy.document().then((doc) => {
                cy.spy(doc, 'execCommand').as('execCommandSpy');
            });

            // # click on permalink option
            cy.get(`#permalink_${postId}`).should('be.visible').click();

            // # copy permalink from button
            cy.get('#linkModalCopyLink').click();

            // # Copy link url from text area
            cy.get('#linkModalTextArea').invoke('val').as('linkText');

            cy.get('@execCommandSpy').should('have.been.calledWith', 'copy');

            // # Check if link is copied properly
            cy.get('.modal-footer').within(() => {
                cy.get('p').first().should('have.text', ' Link copied');
            });

            // # close modal dialog
            cy.get('#linkModalCloseButton').click();
        });

        // # get current team id
        cy.getCurrentTeamId().then((teamId) => {
            // # create public channel to post permalink
            cy.apiCreateChannel(teamId, channelName, channelName, 'O', 'Test channel').then((response) => {
                const testChannel = response.body;

                // # click on test public channel
                cy.get('#sidebarItem_' + testChannel.name).click();
                cy.wait(TIMEOUTS.TINY);

                // # paste link on postlist area
                cy.get('@linkText').then((linkText) => {
                    cy.get('#post_textbox').type(linkText).type('{enter}');

                    // # Get last post id from that postlist area
                    cy.getLastPostId().then((postId) => {
                        // # Click on permalink
                        cy.get(`#postMessageText_${postId}`).click('left');

                        // # Check if url include the permalink
                        cy.url().should('include', linkText);

                        // # Get last post id from open channel
                        cy.getLastPostId().then((clickedpostid) => {
                            // # Check the sent message
                            cy.get(`#postMessageText_${clickedpostid}`).should('be.visible').as('postMessageText');
                            cy.get('@postMessageText').should('be.visible').and('have.text', message);
                        });
                    });
                });
            });
        });
    });
});

/// <reference types="cypress" />

import '../../../../support/index';
import { stakeholderTableRows } from '../../../views/stakeholder.view';

const userName = Cypress.env('user');
const userPassword = Cypress.env('pass');
const tackleUiUrl = Cypress.env('tackleUrl');

var stakeholder;

describe('Create New Stakeholder', () => {
    before('Login and load data', function() {

        // Get stakeholder data object through random generator
        cy.task("stakeholderData").then((object) => {
            stakeholder = object;
        });

        // Perform login
        cy.login(userName, userPassword);

        // Interceptors
        cy.intercept('POST', '/api/controls/stakeholder*').as('postStakeholder');
        cy.intercept('GET', '/api/controls/stakeholder*').as('getStakeholders');

        // Ensure Stakeholders page is opened
        cy.visit(tackleUiUrl + '/controls/stakeholders');
        cy.get('span.pf-c-tabs__item-text').should('contain', 'Stakeholders');

        // Select max(100) number of items to display from table per page
        cy.selectItemsPerPage(100);
    });

    it('Single stakeholder with email and display name', function() {
        cy.createStakeholderMin(stakeholder);

        // Wait untill stakeholder create api is executed
        cy.wait('@postStakeholder');

        // Assert that newly created stakeholder exist
        cy.get(stakeholderTableRows).get('td[data-label=Email]').should('contain', stakeholder.email);
        cy.get(stakeholderTableRows).get('td[data-label="Display name"]').should('contain', stakeholder.displayName);
    });
});

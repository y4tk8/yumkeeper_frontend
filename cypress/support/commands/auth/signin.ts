import { buildAuthHeaders, buildUserData } from "../../utils/auth";

Cypress.Commands.add("mockSigninAPI", (user) => {
  cy.intercept("POST", "/api/v1/auth/sign_in", (req) => {
    req.reply({
      statusCode: 200,
      headers: buildAuthHeaders(user.email),
      body: {
        data: buildUserData(user.email),
      },
    });
  }).as("signinRequest");
});

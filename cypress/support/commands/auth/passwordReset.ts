import { buildAuthHeaders, buildUserData } from "../../utils/auth";

Cypress.Commands.add("mockPasswordForgotAPI", () => {
  cy.intercept("POST", "/api/v1/auth/password", {
    statusCode: 200,
  }).as("passwordForgotRequest");
});

Cypress.Commands.add("mockPasswordResetEmail", (user) => {
  cy.intercept("GET", `/mailbox/emails?recipient=${user.email}`, {
    statusCode: 200,
    body: [
      {
        subject: "パスワードリセット",
        body: `<a href="http://localhost:3000/password-reset?reset_password_token=dummy-token">パスワードをリセットする</a>`,
      },
    ],
  }).as("fetchPasswordResetEmail");
});

Cypress.Commands.add("clickResetLink", () => {
  cy.visit("/password-reset?reset_password_token=dummy-token");
});

Cypress.Commands.add("mockPasswordResetAPI", (user) => {
  cy.intercept("PUT", "/api/v1/auth/password", (req) => {
    req.reply({
      statusCode: 200,
      headers: buildAuthHeaders(user.email),
      body: {
        status: "success",
        data: buildUserData(user.email),
      },
    });
  }).as("passwordResetRequest")
});

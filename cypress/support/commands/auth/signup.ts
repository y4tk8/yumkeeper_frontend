Cypress.Commands.add("signupViaUI", (user) => {
  cy.visit("/signup");
  cy.get('input[type="email"]').type(user.email);
  cy.get('input[placeholder="パスワード"]').type(user.password);
  cy.get('input[placeholder="パスワード確認用"]').type(user.password_confirmation);
  cy.contains("登録する（無料）").click();
});

Cypress.Commands.add("mockSignupAPI", () => {
  cy.intercept("POST", "/api/v1/auth", {
    statusCode: 200,
  }).as("signupRequest");
});

Cypress.Commands.add("mockConfirmationEmail", (user) => {
  cy.intercept("GET", `/mailbox/emails?recipient=${user.email}`, {
    statusCode: 200,
    body: [
      {
        subject: "アカウントを認証してください",
        body: `<a href="http://localhost:3000/?account_confirmation_success=true">アカウントを認証する</a>`,
      },
    ],
  }).as("fetchEmail");
});

Cypress.Commands.add("clickConfirmationLink", () => {
  cy.visit("/?account_confirmation_success=true");
});

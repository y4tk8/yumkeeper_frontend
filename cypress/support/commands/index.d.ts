declare namespace Cypress {
  interface Chainable {
    signupViaUI(user: {
      email: string;
      password: string;
      password_confirmation: string;
    }): Chainable<void>;

    mockSignupAPI(): Chainable<void>;

    mockConfirmationEmail(user: { email: string }): Chainable<void>;

    clickConfirmationLink(): Chainable<void>;

    mockPasswordForgotAPI(): Chainable<void>;

    mockPasswordResetEmail(user: { email: string }): Chainable<void>;

    clickResetLink(): Chainable<void>;

    mockPasswordResetAPI(user: { email: string }): Chainable<void>;

    mockSigninAPI(user: { email: string }): Chainable<void>;
  }
}

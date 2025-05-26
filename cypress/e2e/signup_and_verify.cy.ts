describe("正常系: サインアップから認証完了まで", () => {
  let user: {
    email: string;
    password: string;
    password_confirmation: string;
  };

  before(() => {
    cy.fixture("user").then((newUser) => {
      user = newUser;
    });
  });

  it("サインアップ -> 認証メール送信 -> リンク押下 -> リダイレクト & トースト表示", () => {
    cy.mockSignupAPI();

    cy.signupViaUI(user);

    cy.wait("@signupRequest");

    cy.url().should("include", "/verify-account");
    cy.contains("登録ありがとうございます");

    cy.mockConfirmationEmail(user);

    cy.clickConfirmationLink();

    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
    cy.contains("アカウントが正常に認証されました").should("be.visible");
  });
});

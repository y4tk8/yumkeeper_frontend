describe("正常系: サインアップから認証完了まで", () => {
  let user: {
    email: string;
    password: string;
    password_confirmation: string;
  };

  beforeEach(() => {
    cy.fixture("user").then((newUser) => {
      user = newUser;
    });
  });

  it("サインアップ -> メール送信 -> 認証リンク押下 -> リダイレクト & トースト表示", () => {
    cy.mockSignupAPI();

    cy.signupViaUI(user);

    cy.wait("@signupRequest");

    cy.url().should("include", "/verify-account");
    cy.contains("登録ありがとうございます");

    // モックで認証メールを取得
    cy.mockConfirmationEmail(user);

    cy.clickConfirmationLink();

    // トップページへのリダイレクト & トースト表示
    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
    cy.contains("アカウントが正常に認証されました").should("be.visible");
  });
});

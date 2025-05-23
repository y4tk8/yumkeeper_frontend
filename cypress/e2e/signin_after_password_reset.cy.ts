describe("正常系: パスワードリセットからサインインまで", () => {
  let user: {
    email: string;
    password: string;
    password_confirmation: string;
  };

  const newPassword = "newPassword123";

  beforeEach(() => {
    cy.fixture("user").then((u) => {
      user = u;
    });
  });

  it("パスワードリセットメール送信 -> リンク押下 -> パスワード更新 -> 新パスワードでサインイン", () => {
    cy.visit("/password-forgot");

    cy.mockPasswordForgotAPI();

    cy.get('input[type="email"]').type(user.email);
    cy.contains("パスワードリセットメールを送信").click();

    cy.wait("@passwordForgotRequest");

    cy.mockPasswordResetEmail(user);

    cy.mockPasswordResetAPI(user);

    cy.clickResetLink();

    cy.get('input[placeholder="新しいパスワード"]').type(newPassword);
    cy.get('input[placeholder="新しいパスワード確認用"]').type(newPassword);
    cy.contains("パスワードをリセットする").click();

    cy.wait("@passwordResetRequest");

    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
    cy.contains("パスワードがリセットされました").should("be.visible");

    cy.mockSigninAPI(user);

    cy.visit("/signin");
    cy.get('input[type="email"]').type(user.email);
    cy.get('input[type="password"]').type(newPassword);
    cy.get("form").submit();

    cy.wait("@signinRequest");

    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
    cy.contains("ログインしました").should("be.visible");
  });
});

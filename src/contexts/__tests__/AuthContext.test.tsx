import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { AuthContext, AuthProvider } from "@/contexts/AuthContext";

// ローカルストレージの処理をモック化
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => store[key] = value),
    removeItem: vi.fn((key: string) => delete store[key]),
    clear: vi.fn(() => store = {}),
  };
})();

// ローカルストレージを上記で定義したモックで上書き
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

let ctx: React.ContextType<typeof AuthContext> | undefined;

const TestContext = () => {
  ctx = React.useContext(AuthContext);

  if (!ctx) return <div>Missing Provider</div>;

  return (
    <div>
      <div data-testid="userId">userId: {ctx.userId}</div>
      <div data-testid="userRole">role: {ctx.userRole}</div>
      <div data-testid="isAuthenticated">
        isAuthenticated: {ctx.isAuthenticated ? "true" : "false"}
      </div>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    ctx = undefined;
    cleanup();
  });

  it("認証情報とセッターを提供する", async () => {
    render (
      <AuthProvider>
        <TestContext />
      </AuthProvider>
    );

    await act(() => {
      ctx?.setUserId(3);
      ctx?.setUserRole("ゲスト");
      ctx?.setAuthHeaders({ accessToken: "token", client: "client123", uid: "guest123@example.com" });
    });

    expect(await screen.findByTestId("userId")).toHaveTextContent("userId: 3");
    expect(screen.getByTestId("userRole")).toHaveTextContent("role: ゲスト");
    expect(screen.getByTestId("isAuthenticated")).toHaveTextContent("isAuthenticated: true");

    // ローカルストレージにも認証情報が同期される
    expect(localStorage.setItem).toHaveBeenCalledWith("userId", "3");
    expect(localStorage.setItem).toHaveBeenCalledWith("userRole", "ゲスト");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "authHeaders",
      JSON.stringify({ accessToken: "token", client: "client123", uid: "guest123@example.com" })
    );
  });

  it("マウント時にローカルストレージから状態を復元する", async () => {
    // 復元用の認証情報をローカルストレージにセット
    localStorage.setItem("userId", "5");
    localStorage.setItem("userRole", "ゲスト");
    localStorage.setItem(
      "authHeaders",
      JSON.stringify({ accessToken: "token", client: "client456", uid: "guest456@example.com" })
    );

    render(
      <AuthProvider>
        <TestContext />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("userId")).toHaveTextContent("userId: 5");
      expect(screen.getByTestId("userRole")).toHaveTextContent("role: ゲスト");
      expect(screen.getByTestId("isAuthenticated")).toHaveTextContent("isAuthenticated: true");
    });
  });

  it("Providerのラップ漏れがある場合、Missing Providerを表示", () => {
    render(<TestContext />);
    expect(screen.getByText("Missing Provider")).toBeInTheDocument();
  });
});

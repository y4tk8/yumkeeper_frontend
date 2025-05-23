export const buildAuthHeaders = (email: string) => ({
  "access-token": "mock-token",
  "client": "mock-client",
  "uid": email,
  "token-type": "Bearer",
  "expiry": `${Date.now() + 1000 * 60 * 60}`, // 1時間後
});

export const buildUserData = (email: string) => ({
  id: 1,
  email,
  uid: email,
  provider: "email",
  allow_password_change: false,
  role: "一般",
});

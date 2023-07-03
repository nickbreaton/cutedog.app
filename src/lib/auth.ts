import { parseCookie } from "solid-start";

export function isValidPassword(password: string) {
  const envPassword = process.env.PASSWORD;

  if (!envPassword) {
    throw new Error("PASSWORD is not set");
  }

  return password === envPassword;
}

export function isAuthorizedRequest(request: Request) {
  const { password } = parseCookie(request.headers.get("Cookie") ?? "");
  const url = new URL(request.url);
  return isValidPassword(password) || url.pathname === "/login";
}

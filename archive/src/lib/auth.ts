import { parseCookie } from "solid-start";
import { assertEnv } from "./env";

export function isValidPassword(password: string) {
  return password === assertEnv("PASSWORD");
}

export function isAuthorizedRequest(request: Request) {
  const { password } = parseCookie(request.headers.get("Cookie") ?? "");
  const url = new URL(request.url);
  return isValidPassword(password) || url.pathname === "/login";
}

import { createRouteAction, serializeCookie } from "solid-start";
import { APIEvent } from "solid-start/api/types";
import { json } from "solid-start/server";
import { isValidPassword } from "~/lib/auth";
import { getDateOneYearFromNow } from "~/lib/date";

export async function POST(event: APIEvent) {
  const { password } = await event.request.json();

  if (isValidPassword(password)) {
    return json(
      { type: "valid" },
      {
        headers: {
          "Set-Cookie": serializeCookie("password", password, {
            httpOnly: true,
            secure: true,
            sameSite: true,
            expires: getDateOneYearFromNow(),
          }),
        },
      }
    );
  }

  return json({ type: "invalid", message: "Password is invalid" });
}

export default function Home() {
  const [submitting, { Form }] = createRouteAction(async (data: FormData) => {
    const response = await fetch("/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password: data.get("password") }),
    });

    const result = await response.json();

    if (result.type === "valid") {
      window.location.assign("/");
      return;
    }

    return result;
  });

  return (
    <Form>
      Password
      <input type="password" name="password" disabled={submitting.pending} />
      <p>{submitting.result?.type === "invalid" ? submitting.result.message : null}</p>
    </Form>
  );
}

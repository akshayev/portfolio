import { NextResponse } from "next/server";

import { logAuditEvent } from "@/lib/security/audit";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { getClientIp, getRequestId, isSameOriginRequest, readJsonBody } from "@/lib/security/request";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type SignupPayload = {
  email?: unknown;
  password?: unknown;
  username?: unknown;
};

const AUTH_ROUTE = "/api/auth/signup";

function deny(error: string, status: number, retryAfterSeconds?: number) {
  return NextResponse.json(
    { ok: false, error },
    {
      status,
      headers: retryAfterSeconds
        ? {
            "retry-after": String(retryAfterSeconds),
          }
        : undefined,
    },
  );
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const requestId = getRequestId(request);

  if (!isSameOriginRequest(request)) {
    logAuditEvent("warn", {
      route: AUTH_ROUTE,
      action: "signup",
      message: "Rejected non same-origin signup request",
      requestId,
      ip,
    });
    return deny("forbidden", 403);
  }

  const payload = await readJsonBody<SignupPayload>(request, 8 * 1024);
  if (!payload) {
    return deny("invalid_json", 400);
  }

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const password = typeof payload.password === "string" ? payload.password : "";
  const username = typeof payload.username === "string" ? payload.username.trim().toLowerCase() : "";

  if (!email || !password || !username || password.length > 256 || email.length > 320 || username.length > 50) {
    return deny("invalid_input", 400);
  }

  const ipLimit = checkRateLimit({
    key: `${AUTH_ROUTE}:ip:${ip}`,
    limit: 10,
    windowMs: 60_000,
  });

  if (!ipLimit.ok) {
    return deny("rate_limited", 429, ipLimit.retryAfterSeconds);
  }

  const client = await createServerSupabaseClient();
  if (!client) {
    return deny("service_unavailable", 503);
  }

  // Check if username is taken
  const { data: existingUser } = await client
    .from("user_profiles")
    .select("username")
    .eq("username", username)
    .single();

  if (existingUser) {
    return deny("username_taken", 409);
  }

  const { data, error } = await client.auth.signUp({ 
    email, 
    password,
    options: {
      data: {
        username
      }
    }
  });

  if (error) {
    return deny(error.message || "signup_failed", 400);
  }

  if (data.user) {
    // Attempt to insert profile. 
    // Depending on Supabase configuration, the user session might be active here if email confirm is off.
    const { error: profileError } = await client.from("user_profiles").insert({
      user_id: data.user.id,
      username: username,
      display_name: username,
    });

    if (profileError) {
      logAuditEvent("error", {
        route: AUTH_ROUTE,
        action: "signup_profile_creation",
        message: "Failed to create user profile",
        requestId,
        ip,
        metadata: { error: profileError },
      });
      // We don't fail the request completely as the auth user is created, but they might need support to fix their profile.
    }
  }

  return NextResponse.json({ ok: true });
}

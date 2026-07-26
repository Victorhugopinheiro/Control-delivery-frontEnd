import "server-only";

import { headers } from "next/headers";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authApiConfig, buildAuthUrl } from "@/lib/auth/config";

function normalizeUrl(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

async function resolveServerBaseUrl(): Promise<string> {
  if (authApiConfig.apiBaseUrl) {
    return normalizeUrl(authApiConfig.apiBaseUrl);
  }

  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

  if (!host) {
    return "http://localhost:3000";
  }

  return `${protocol}://${host}`;
}

export async function hasAuthCookie(): Promise<boolean> {
  const cookieStore = await cookies();
  return Boolean(
    cookieStore.get("accessToken")?.value ||
    cookieStore.get("refreshToken")?.value
  );
}

async function hasValidSession(): Promise<boolean> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // Require at least one token to attempt validation
  if (!accessToken && !refreshToken) {
    return false;
  }



  // Build a minimal Cookie header with only auth cookies
  const authCookies = [
    accessToken ? `accessToken=${encodeURIComponent(accessToken)}` : null,
    refreshToken ? `refreshToken=${encodeURIComponent(refreshToken)}` : null,
  ]
    .filter(Boolean)
    .join("; ");

  const baseUrl = await resolveServerBaseUrl();
  const meUrl = buildAuthUrl(authApiConfig.mePath);
  const requestUrl =
    meUrl.startsWith("http://") || meUrl.startsWith("https://")
      ? meUrl
      : `${baseUrl}${meUrl}`;

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      Cookie: authCookies,
    },
    cache: "no-store",
  });

  return response.ok;
}

export async function requireAuth(): Promise<void> {
  const authenticated = await hasValidSession();

  if (!authenticated) {
    redirect("/login");
  }
}

export async function redirectIfAuthenticated(): Promise<void> {
  const authenticated = await hasValidSession();

  if (authenticated) {
    redirect("/dashboard");
  }
}

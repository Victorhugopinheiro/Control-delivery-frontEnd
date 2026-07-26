import { AuthApiConfig } from "@/lib/auth/types";

function normalizeBaseUrl(baseUrl: string | undefined): string {
  if (!baseUrl) {
    return "";
  }

  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

export const authApiConfig: AuthApiConfig = {
  apiBaseUrl: normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL),
  loginPath: process.env.NEXT_PUBLIC_AUTH_LOGIN_PATH ?? "/auth/login",
  logoutPath: process.env.NEXT_PUBLIC_AUTH_LOGOUT_PATH ?? "/auth/logout",
  mePath: process.env.NEXT_PUBLIC_AUTH_ME_PATH! ,
  cookieName: process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME ?? "session",
};

export function buildAuthUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${authApiConfig.apiBaseUrl}${normalizedPath}`;
}

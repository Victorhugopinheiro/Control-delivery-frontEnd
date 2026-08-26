export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthUser {
  id: string | number;
  email: string;
  name?: string;
  role?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthApiConfig {
  apiBaseUrl: string;
  mePath: string;
}

import { jwtDecode } from 'jwt-decode';

export type JwtPayload = {
  exp?: number;
  name?: string;
  nameid?: string;
  // .NET’in rol claim’i ve alternatifleri:
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string | string[];
  role?: string | string[];
  // .NET’in nameidentifier alternatifleri:
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string;
};

export const parseRoles = (token: string): string[] => {
  const p = jwtDecode<JwtPayload>(token);
  const raw = p['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? p.role;
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
};

export const parseUserId = (token: string): string | null => {
  const p = jwtDecode<JwtPayload>(token);
  return (
    p['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ??
    p.nameid ??
    null
  );
};

export default {
  API_URL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/customers',
  AUTH_API_URL: import.meta.env.VITE_AUTH_API_URL ?? 'http://localhost:8080/api/auth',
  AUDIT_API_URL: import.meta.env.VITE_AUDIT_API_URL ?? 'http://localhost:8080/api/audit-logs',
};
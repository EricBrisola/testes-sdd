import axios from 'axios';

const getBaseURL = (): string => {
  try {
    // Evita erro de compilação em ambiente de teste (Jest/CommonJS)
    const metaEnv = (0, eval)('typeof import.meta !== "undefined" ? import.meta.env : undefined');
    return metaEnv?.VITE_API_URL || 'http://localhost:3000';
  } catch {
    return 'http://localhost:3000';
  }
};

export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

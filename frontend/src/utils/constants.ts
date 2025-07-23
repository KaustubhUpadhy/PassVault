export const APP_NAME = 'PassVault';

export const PASSWORD_SETTINGS = {
  MIN_LENGTH: 4,
  MAX_LENGTH: 50,
  DEFAULT_LENGTH: 12,
};

export const TOAST_DURATION = 3000;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  PASSWORDS: {
    GENERATE: '/passwords/generate',
    SAVE: '/passwords/save',
    LIST: '/passwords/list',
    DELETE: '/passwords/delete',
    UPDATE: '/passwords/update',
  },
  SECURITY: {
    CHECK_STRENGTH: '/security/strength',
    CHECK_BREACH: '/security/breach',
  },
};
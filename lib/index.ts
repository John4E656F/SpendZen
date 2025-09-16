export const getBackendUrl = (): string => {
  const nodeEnv = process.env.NODE_MODE || 'development';
  const baseUrl = process.env.BACKEND_URL || '192.168.129.234:8080';

  // If development and IP address (local), force http
  if (nodeEnv === 'development') {
    // If baseUrl looks like an IP or localhost, use http
    if (baseUrl.match(/^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/) || baseUrl.startsWith('localhost')) {
      return `http://${baseUrl}`;
    }
  }

  // For production, use https
  return `https://${baseUrl}`;
};

export { saveUserToDb, getUserFromDb, checkUserStatus } from './user';
export { saveGoalToDb } from './goal';

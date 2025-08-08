/**
 * Configuration settings for the application
 */
const config = {
  // WebSocket URL for real-time data
  // LiveSocketURL: 'wss://hbrsocket.hbrgold.com/',
  LiveSocketURL: 'http://69.62.82.235:3001',

  // API base URL (placeholder - update with actual API URL if needed)
  // ApiBaseURL: process.env.REACT_APP_API_URL || 'https://api.hbrgold.com/',
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'https://hbrbackend.hbrgold.com/api',

  // Default request timeout in milliseconds
  RequestTimeout: 30000,
};

export default config;
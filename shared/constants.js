// Shared constants for the Iron Dome alert system

// API Endpoints
export const API_ENDPOINTS = {
  ALERTS: "/api/alerts",
  LOG_LOCATION: "/api/log-location",
  HEALTH: "/health",
};

// Alert levels
export const ALERT_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
};

// Time intervals (in milliseconds)
export const TIME_INTERVALS = {
  ALERT_REFRESH: 30000, // 30 seconds
  LOCATION_LOG: 300000, // 5 minutes
  HEALTH_CHECK: 60000, // 1 minute
};

// Default coordinates for Israel
export const DEFAULT_COORDINATES = {
  lat: 31.5,
  lng: 34.75,
  zoom: 8,
};

// Supported languages
export const LANGUAGES = {
  THAI: "th",
  ENGLISH: "en",
  HEBREW: "he",
};

// MongoDB collection names
export const COLLECTIONS = {
  LOCATION_LOGS: "location-logs",
  ALERT_HISTORY: "alert-history",
};

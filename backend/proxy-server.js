const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI environment variable is required");
  process.exit(1);
}
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

// CORS configuration
const corsOptions = {
  origin: [
    process.env.CORS_ORIGIN || "http://localhost:3000",
    "https://thai-migrant-rocket-safe-frontend-4.vercel.app",
    /\.vercel\.app$/,
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Enable CORS for all routes
app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON bodies

// Proxy endpoint for alerts
app.get("/api/alerts", async (req, res) => {
  try {
    console.log("Fetching alerts from Tzeva Adom API...");

    // Use dynamic import for node-fetch
    const fetch = (await import("node-fetch")).default;

    const alertApiUrl =
      process.env.ALERT_API_URL ||
      "https://www.tzevaadom.co.il/static/historical/all.json";

    const response = await fetch(alertApiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.tzevaadom.co.il/en/historical/",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Set cache headers
    res.set({
      "Cache-Control": "public, max-age=3200",
      "Content-Type": "application/json",
    });

    console.log(`Successfully fetched ${data.length} alert records`);
    res.json(data);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    res.status(500).json({
      error: "Failed to fetch alerts data",
      message: error.message,
    });
  }
});

// Location logging endpoint
app.post("/api/log-location", async (req, res) => {
  try {
    const { latitude, longitude, safetyResult, timestamp, userAgent } =
      req.body;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude are required" });
    }

    const client = await connectToDatabase();
    const db = client.db("rocket-migrant-safe");
    const collection = db.collection("location-logs");

    // Create the log entry
    const logEntry = {
      location: {
        type: "Point",
        coordinates: [longitude, latitude], // GeoJSON format: [lng, lat]
      },
      latitude,
      longitude,
      safetyResult: {
        status: safetyResult?.status || "unknown",
        recentAlerts: safetyResult?.recentAlerts || 0,
        historicalAlerts: safetyResult?.historicalAlerts || 0,
        nearestAlert: safetyResult?.nearestAlert || null,
        riskLevel: safetyResult?.riskLevel || "unknown",
      },
      timestamp: timestamp || new Date(),
      userAgent: userAgent || req.headers["user-agent"] || "unknown",
      ip:
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        "unknown",
      createdAt: new Date(),
    };

    // Insert the log entry
    const result = await collection.insertOne(logEntry);

    // Create geospatial index if it doesn't exist
    try {
      await collection.createIndex({ location: "2dsphere" });
    } catch (indexError) {
      // Index might already exist, ignore error
      console.log(
        "Geospatial index already exists or failed to create:",
        indexError.message
      );
    }

    console.log("📍 Location logged successfully:", {
      id: result.insertedId,
      lat: latitude,
      lng: longitude,
      status: safetyResult?.status,
      timestamp: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      id: result.insertedId,
      message: "Location logged successfully",
    });
  } catch (error) {
    console.error("❌ Error logging location:", error);
    res.status(500).json({
      error: "Failed to log location",
      details: error.message,
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
    environment: process.env.NODE_ENV || "development",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    message: `Route ${req.method} ${req.path} not found`,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Alerts API available at http://localhost:${PORT}/api/alerts`);
  console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});

module.exports = app;

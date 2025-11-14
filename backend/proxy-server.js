const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Israel geographic boundaries
const ISRAEL_BOUNDS = {
  north: 33.4, // Northern border (Lebanon)
  south: 29.4, // Southern border (Egypt/Red Sea)
  east: 35.9, // Eastern border (Jordan River/Dead Sea)
  west: 34.2, // Western border (Mediterranean Sea)
};

// Function to check if coordinates are within Israel
function isWithinIsrael(latitude, longitude) {
  if (!latitude || !longitude) return false;

  return (
    latitude >= ISRAEL_BOUNDS.south &&
    latitude <= ISRAEL_BOUNDS.north &&
    longitude >= ISRAEL_BOUNDS.west &&
    longitude <= ISRAEL_BOUNDS.east
  );
}

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI environment variable is required");
  process.exit(1);
}

let cachedClient = null;
let isConnecting = false;

async function connectToDatabase() {
  if (cachedClient) {
    try {
      // Test the connection
      await cachedClient.db().admin().ping();
      return cachedClient;
    } catch (error) {
      console.log("🔄 Cached connection failed, reconnecting...");
      cachedClient = null;
    }
  }

  if (isConnecting) {
    // Wait for existing connection attempt
    let attempts = 0;
    while (isConnecting && attempts < 50) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }
    if (cachedClient) return cachedClient;
  }

  try {
    isConnecting = true;
    console.log("🔗 Connecting to MongoDB...");

    const client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    });

    await client.connect();
    await client.db().admin().ping();

    cachedClient = client;
    console.log("✅ Connected to MongoDB successfully");
    return client;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error;
  } finally {
    isConnecting = false;
  }
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

// Search query logging endpoint
app.post("/api/log-search", async (req, res) => {
  try {
    const { searchQuery, resultsCount, selectedLocation, language } = req.body;

    if (!searchQuery) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const client = await connectToDatabase();
    const db = client.db("rocket-migrant-safe");
    const collection = db.collection("search-logs");

    // Create the search log entry
    const logEntry = {
      searchQuery: searchQuery.trim(),
      searchQueryLower: searchQuery.trim().toLowerCase(),
      resultsCount: resultsCount || 0,
      selectedLocation: selectedLocation
        ? {
            name: selectedLocation.name || selectedLocation.en,
            nameEn: selectedLocation.en,
            nameHe: selectedLocation.he,
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lng,
          }
        : null,
      language: language || "th",
      userAgent: req.headers["user-agent"] || "unknown",
      ip:
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        "unknown",
      timestamp: new Date(),
      createdAt: new Date(),
    };

    // Insert the log entry
    const result = await collection.insertOne(logEntry);

    // Create indexes for efficient querying
    try {
      await collection.createIndex({ searchQueryLower: 1 });
      await collection.createIndex({ createdAt: -1 });
      await collection.createIndex({ "selectedLocation.name": 1 });
    } catch (indexError) {
      console.log(
        "Indexes already exist or failed to create:",
        indexError.message
      );
    }

    console.log("🔍 Search logged successfully:", {
      id: result.insertedId,
      query: searchQuery,
      results: resultsCount,
      timestamp: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      id: result.insertedId,
      message: "Search logged successfully",
    });
  } catch (error) {
    console.error("❌ Error logging search:", error);
    res.status(500).json({
      error: "Failed to log search",
      details: error.message,
    });
  }
});

// Search analytics endpoint
app.get("/api/analytics/searches", async (req, res) => {
  try {
    const client = await connectToDatabase();
    const db = client.db("rocket-migrant-safe");
    const collection = db.collection("search-logs");

    const days = parseInt(req.query.days) || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Get analytics
    const analytics = await Promise.all([
      // Total searches
      collection.countDocuments({ createdAt: { $gte: since } }),

      // Most searched queries
      collection
        .aggregate([
          { $match: { createdAt: { $gte: since } } },
          {
            $group: {
              _id: "$searchQueryLower",
              count: { $sum: 1 },
              originalQuery: { $first: "$searchQuery" },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 20 },
        ])
        .toArray(),

      // Most selected locations
      collection
        .aggregate([
          {
            $match: {
              createdAt: { $gte: since },
              "selectedLocation.name": { $exists: true },
            },
          },
          {
            $group: {
              _id: "$selectedLocation.nameEn",
              count: { $sum: 1 },
              nameHe: { $first: "$selectedLocation.nameHe" },
              latitude: { $first: "$selectedLocation.latitude" },
              longitude: { $first: "$selectedLocation.longitude" },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 20 },
        ])
        .toArray(),

      // Language distribution
      collection
        .aggregate([
          { $match: { createdAt: { $gte: since } } },
          {
            $group: {
              _id: "$language",
              count: { $sum: 1 },
            },
          },
        ])
        .toArray(),

      // Searches with no results
      collection.countDocuments({
        createdAt: { $gte: since },
        resultsCount: 0,
      }),

      // Daily search activity
      collection
        .aggregate([
          { $match: { createdAt: { $gte: since } } },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),
    ]);

    const [
      totalSearches,
      topQueries,
      topLocations,
      languageDistribution,
      noResultsCount,
      dailyActivity,
    ] = analytics;

    res.json({
      period: `${days} days`,
      since: since.toISOString(),
      summary: {
        totalSearches,
        noResultsCount,
        noResultsPercentage:
          totalSearches > 0
            ? Math.round((noResultsCount / totalSearches) * 100)
            : 0,
        uniqueQueries: topQueries.length,
      },
      topQueries: topQueries.map((q) => ({
        query: q.originalQuery,
        count: q.count,
      })),
      topLocations: topLocations.map((loc) => ({
        name: loc._id,
        nameHe: loc.nameHe,
        count: loc.count,
        latitude: loc.latitude,
        longitude: loc.longitude,
      })),
      languageDistribution,
      dailyActivity,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error fetching search analytics:", error);
    res.status(500).json({
      error: "Failed to fetch search analytics",
      message: error.message,
    });
  }
});

// Dashboard analytics endpoint
app.get("/api/dashboard/analytics", async (req, res) => {
  try {
    const client = await connectToDatabase();
    const db = client.db("rocket-migrant-safe");
    const collection = db.collection("location-logs");

    // Get time range from query params (default to last 30 days)
    const days = parseInt(req.query.days) || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Israel geographic filter
    const israelFilter = {
      createdAt: { $gte: since },
      latitude: { $gte: ISRAEL_BOUNDS.south, $lte: ISRAEL_BOUNDS.north },
      longitude: { $gte: ISRAEL_BOUNDS.west, $lte: ISRAEL_BOUNDS.east },
    };

    // Aggregate analytics (Israel locations only)
    const analytics = await Promise.all([
      // Total location checks in Israel
      collection.countDocuments(israelFilter),

      // Risk level distribution in Israel
      collection
        .aggregate([
          { $match: israelFilter },
          {
            $group: {
              _id: "$safetyResult.riskLevel",
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
        ])
        .toArray(),

      // Safety status distribution in Israel
      collection
        .aggregate([
          { $match: israelFilter },
          {
            $group: {
              _id: "$safetyResult.status",
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
        ])
        .toArray(),

      // Daily activity in Israel (last 7 days)
      collection
        .aggregate([
          {
            $match: {
              createdAt: {
                $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              },
              latitude: {
                $gte: ISRAEL_BOUNDS.south,
                $lte: ISRAEL_BOUNDS.north,
              },
              longitude: { $gte: ISRAEL_BOUNDS.west, $lte: ISRAEL_BOUNDS.east },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),

      // High-risk locations in Israel (recent alerts > 0)
      collection
        .aggregate([
          {
            $match: {
              ...israelFilter,
              "safetyResult.recentAlerts": { $gt: 0 },
            },
          },
          {
            $group: {
              _id: {
                lat: { $round: ["$latitude", 3] },
                lng: { $round: ["$longitude", 3] },
              },
              count: { $sum: 1 },
              avgRecentAlerts: { $avg: "$safetyResult.recentAlerts" },
              maxRecentAlerts: { $max: "$safetyResult.recentAlerts" },
            },
          },
          { $sort: { maxRecentAlerts: -1, count: -1 } },
          { $limit: 10 },
        ])
        .toArray(),
    ]);

    const [
      totalChecks,
      riskLevels,
      safetyStatus,
      dailyActivity,
      highRiskLocations,
    ] = analytics;

    // Calculate risk statistics
    const riskStats = {
      safe: riskLevels.find((r) => r._id === "safe")?.count || 0,
      lowRisk: riskLevels.find((r) => r._id === "low")?.count || 0,
      moderateRisk: riskLevels.find((r) => r._id === "moderate")?.count || 0,
      highRisk: riskLevels.find((r) => r._id === "high")?.count || 0,
      veryHighRisk: riskLevels.find((r) => r._id === "very-high")?.count || 0,
    };

    const riskTotal = Object.values(riskStats).reduce((a, b) => a + b, 0);
    const atRiskCount =
      riskStats.moderateRisk + riskStats.highRisk + riskStats.veryHighRisk;

    res.json({
      period: `${days} days`,
      since: since.toISOString(),
      summary: {
        totalChecks,
        atRiskCount,
        atRiskPercentage:
          riskTotal > 0 ? Math.round((atRiskCount / riskTotal) * 100) : 0,
        safeCount: riskStats.safe + riskStats.lowRisk,
        safePercentage:
          riskTotal > 0
            ? Math.round(
                ((riskStats.safe + riskStats.lowRisk) / riskTotal) * 100
              )
            : 0,
      },
      riskDistribution: riskStats,
      safetyStatus,
      dailyActivity,
      highRiskLocations: highRiskLocations.map((loc) => ({
        latitude: loc._id.lat,
        longitude: loc._id.lng,
        checksCount: loc.count,
        avgRecentAlerts: Math.round(loc.avgRecentAlerts * 10) / 10,
        maxRecentAlerts: loc.maxRecentAlerts,
      })),
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error fetching dashboard analytics:", error);
    res.status(500).json({
      error: "Failed to fetch analytics",
      message: error.message,
    });
  }
});

// Recent location checks endpoint
app.get("/api/dashboard/recent-checks", async (req, res) => {
  try {
    const client = await connectToDatabase();
    const db = client.db("rocket-migrant-safe");
    const collection = db.collection("location-logs");

    const limit = parseInt(req.query.limit) || 50;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    // Filter for Israel locations only
    const israelFilter = {
      latitude: { $gte: ISRAEL_BOUNDS.south, $lte: ISRAEL_BOUNDS.north },
      longitude: { $gte: ISRAEL_BOUNDS.west, $lte: ISRAEL_BOUNDS.east },
    };

    const recentChecks = await collection
      .find(israelFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .project({
        latitude: 1,
        longitude: 1,
        "safetyResult.status": 1,
        "safetyResult.riskLevel": 1,
        "safetyResult.recentAlerts": 1,
        "safetyResult.historicalAlerts": 1,
        createdAt: 1,
        ip: 1,
      })
      .toArray();

    const total = await collection.countDocuments(israelFilter);

    res.json({
      checks: recentChecks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Error fetching recent checks:", error);
    res.status(500).json({
      error: "Failed to fetch recent checks",
      message: error.message,
    });
  }
});

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    // Check MongoDB connection
    const client = await connectToDatabase();
    await client.db().admin().ping();

    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      mongodb: "connected",
    });
  } catch (error) {
    console.error("❌ Health check failed:", error);
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      mongodb: "disconnected",
      error: error.message,
    });
  }
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

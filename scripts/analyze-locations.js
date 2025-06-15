const { MongoClient } = require("mongodb");

const MONGODB_URI =
  "mongodb+srv://sankhamphotography:dVRUHUlvsf0g7C1S@rocket-migrant-safe.7ouw6za.mongodb.net/?retryWrites=true&w=majority&appName=rocket-migrant-safe";

async function analyzeLocationData() {
  let client;

  try {
    console.log("🔗 Connecting to MongoDB...");
    client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db("rocket-migrant-safe");
    const collection = db.collection("location-logs");

    // Get total count
    const totalLogs = await collection.countDocuments();
    console.log(`📊 Total location logs: ${totalLogs}`);

    if (totalLogs === 0) {
      console.log(
        "ℹ️  No location data found yet. Users need to use the safety check feature first."
      );
      return;
    }

    // Get logs from last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentLogs = await collection.countDocuments({
      createdAt: { $gte: yesterday },
    });
    console.log(`📅 Logs from last 24 hours: ${recentLogs}`);

    // Get unique locations (approximate)
    const uniqueLocations = await collection
      .aggregate([
        {
          $group: {
            _id: {
              lat: { $round: ["$latitude", 3] }, // Round to ~100m precision
              lng: { $round: ["$longitude", 3] },
            },
            count: { $sum: 1 },
            firstSeen: { $min: "$createdAt" },
            lastSeen: { $max: "$createdAt" },
          },
        },
        { $sort: { count: -1 } },
      ])
      .toArray();

    console.log(`🗺️  Unique location clusters: ${uniqueLocations.length}`);

    // Show top 10 most frequent locations
    console.log("\n📍 Top 10 most frequent locations:");
    uniqueLocations.slice(0, 10).forEach((loc, index) => {
      console.log(
        `${index + 1}. Lat: ${loc._id.lat}, Lng: ${loc._id.lng} (${
          loc.count
        } checks)`
      );
    });

    // Safety status distribution
    const safetyStats = await collection
      .aggregate([
        {
          $group: {
            _id: "$safetyResult.riskLevel",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ])
      .toArray();

    console.log("\n🚨 Safety status distribution:");
    safetyStats.forEach((stat) => {
      console.log(`${stat._id || "unknown"}: ${stat.count} checks`);
    });

    // Recent alerts distribution
    const alertStats = await collection
      .aggregate([
        {
          $group: {
            _id: "$safetyResult.recentAlerts",
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    console.log("\n⚠️  Recent alerts distribution:");
    alertStats.forEach((stat) => {
      console.log(`${stat._id} recent alerts: ${stat.count} locations`);
    });

    // Geographic bounds
    const bounds = await collection
      .aggregate([
        {
          $group: {
            _id: null,
            minLat: { $min: "$latitude" },
            maxLat: { $max: "$latitude" },
            minLng: { $min: "$longitude" },
            maxLng: { $max: "$longitude" },
          },
        },
      ])
      .toArray();

    if (bounds.length > 0) {
      const bound = bounds[0];
      console.log("\n🌍 Geographic coverage:");
      console.log(
        `Latitude range: ${bound.minLat.toFixed(4)} to ${bound.maxLat.toFixed(
          4
        )}`
      );
      console.log(
        `Longitude range: ${bound.minLng.toFixed(4)} to ${bound.maxLng.toFixed(
          4
        )}`
      );
    }

    // Time distribution
    const timeStats = await collection
      .aggregate([
        {
          $group: {
            _id: {
              hour: { $hour: "$createdAt" },
              dayOfWeek: { $dayOfWeek: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.dayOfWeek": 1, "_id.hour": 1 } },
      ])
      .toArray();

    console.log("\n⏰ Usage patterns by hour and day:");
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    timeStats.forEach((stat) => {
      console.log(
        `${days[stat._id.dayOfWeek - 1]} ${stat._id.hour}:00 - ${
          stat.count
        } checks`
      );
    });
  } catch (error) {
    console.error("❌ Error analyzing location data:", error);
  } finally {
    if (client) {
      await client.close();
      console.log("\n✅ Analysis complete. Database connection closed.");
    }
  }
}

// Export locations to GeoJSON for mapping
async function exportToGeoJSON() {
  let client;

  try {
    console.log("🔗 Connecting to MongoDB for GeoJSON export...");
    client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db("rocket-migrant-safe");
    const collection = db.collection("location-logs");

    const locations = await collection.find({}).toArray();

    const geoJSON = {
      type: "FeatureCollection",
      features: locations.map((log) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [log.longitude, log.latitude],
        },
        properties: {
          timestamp: log.createdAt,
          safetyStatus: log.safetyResult?.riskLevel || "unknown",
          recentAlerts: log.safetyResult?.recentAlerts || 0,
          historicalAlerts: log.safetyResult?.historicalAlerts || 0,
        },
      })),
    };

    const fs = require("fs");
    fs.writeFileSync(
      "thai-worker-locations.geojson",
      JSON.stringify(geoJSON, null, 2)
    );
    console.log(
      `📄 Exported ${locations.length} locations to thai-worker-locations.geojson`
    );
  } catch (error) {
    console.error("❌ Error exporting GeoJSON:", error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Run analysis
if (require.main === module) {
  const command = process.argv[2];

  if (command === "export") {
    exportToGeoJSON();
  } else {
    analyzeLocationData();
  }
}

module.exports = { analyzeLocationData, exportToGeoJSON };

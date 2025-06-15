# Location Logging System

This system logs user locations when they use the "เช็คว่าปัจจุบันปลอดภัยไหม" (Check Current Location Safety) feature to help understand where Thai migrant workers are located in Israel.

## 🎯 Purpose

- **Data Collection**: Gather real-world location data of Thai workers using the safety app
- **Geographic Analysis**: Understand distribution patterns and concentration areas
- **Safety Insights**: Correlate location data with alert frequency and safety status
- **Research**: Support policy and safety planning for Thai migrant worker communities

## 📊 Data Collected

Each location check logs the following information:

```json
{
  "location": {
    "type": "Point",
    "coordinates": [longitude, latitude]
  },
  "latitude": 31.7683,
  "longitude": 35.2137,
  "safetyResult": {
    "status": "safe|moderateRisk|highRisk|veryHighRisk",
    "recentAlerts": 0,
    "historicalAlerts": 15,
    "nearestAlert": {...},
    "riskLevel": "safe"
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "userAgent": "Mozilla/5.0...",
  "ip": "192.168.1.1",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

## 🔧 Technical Implementation

### Database

- **MongoDB Atlas**: Cloud-hosted database
- **Collection**: `location-logs` in `rocket-migrant-safe` database
- **Indexing**: 2dsphere geospatial index for location queries

### API Endpoint

- **URL**: `http://localhost:3001/api/log-location`
- **Method**: POST
- **CORS**: Enabled for frontend access

### Privacy & Security

- **No Personal Data**: Only location coordinates and safety results
- **Anonymous**: No user identification or tracking
- **Secure Connection**: MongoDB connection uses SSL/TLS
- **IP Logging**: For basic analytics only, not user identification

## 📈 Data Analysis

### View Current Statistics

```bash
npm run analyze-locations
```

This will show:

- Total number of location checks
- Recent activity (last 24 hours)
- Unique location clusters
- Most frequent check locations
- Safety status distribution
- Geographic coverage bounds
- Usage patterns by time/day

### Export Data for Mapping

```bash
npm run export-locations
```

This creates `thai-worker-locations.geojson` file that can be:

- Imported into GIS software (QGIS, ArcGIS)
- Visualized on web maps
- Used for spatial analysis

## 🗺️ Geographic Insights

The system provides insights into:

1. **Concentration Areas**: Where Thai workers are most active
2. **Safety Patterns**: Correlation between location and alert frequency
3. **Usage Timing**: When and where safety checks are most common
4. **Geographic Spread**: Coverage across different regions of Israel

## 📋 Usage Examples

### Basic Analysis

```javascript
const { analyzeLocationData } = require("./scripts/analyze-locations");
await analyzeLocationData();
```

### Custom Queries

```javascript
// Find locations with high alert activity
db.location -
  logs.find({
    "safetyResult.recentAlerts": { $gte: 3 },
  });

// Get locations within specific area
db.location -
  logs.find({
    location: {
      $geoWithin: {
        $centerSphere: [[35.2137, 31.7683], 10 / 6378.1], // 10km radius
      },
    },
  });
```

## 🔒 Data Retention & Privacy

- **Purpose Limitation**: Data used only for safety and research purposes
- **Anonymization**: No personal identifiers stored
- **Retention**: Data retained for research and safety analysis
- **Access Control**: Database access restricted to authorized personnel

## 🚀 Future Enhancements

1. **Real-time Dashboard**: Live visualization of location data
2. **Heat Maps**: Density visualization of Thai worker locations
3. **Trend Analysis**: Historical patterns and changes over time
4. **Integration**: Combine with official Thai worker registration data
5. **Alerts**: Notify relevant authorities of high-risk area usage

## 📞 Contact

For questions about the location logging system or data access:

- Technical: Review the code in `proxy-server.js` and `scripts/analyze-locations.js`
- Data Analysis: Use the provided NPM scripts for insights
- Privacy Concerns: All data is anonymized and used for safety purposes only

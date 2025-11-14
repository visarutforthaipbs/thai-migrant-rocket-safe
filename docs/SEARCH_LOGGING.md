# Search Query Logging

This document describes the search query logging feature that tracks what Thai migrant workers are searching for on the workplace safety lookup page.

## Overview

The system automatically logs all search queries to MongoDB, including:

- Search terms entered by users
- Number of results returned
- Selected locations (when users click on a result)
- Language used (Thai/English)
- Timestamp and basic metadata

## Database Schema

### Collection: `search-logs`

```javascript
{
  _id: ObjectId,
  searchQuery: String,           // Original search query as entered
  searchQueryLower: String,       // Lowercase version for analysis
  resultsCount: Number,           // Number of results returned
  selectedLocation: {             // If user selected a location
    name: String,                 // Location name
    nameEn: String,               // English name
    nameHe: String,               // Hebrew name
    latitude: Number,
    longitude: Number
  },
  language: String,               // 'th' or 'en'
  userAgent: String,              // Browser user agent
  ip: String,                     // User IP address
  timestamp: Date,                // Search timestamp
  createdAt: Date                 // Record creation timestamp
}
```

### Indexes

- `searchQueryLower` - For efficient query analysis
- `createdAt` - For time-based queries
- `selectedLocation.name` - For location popularity analysis

## API Endpoints

### Log Search Query

```http
POST /api/log-search
Content-Type: application/json

{
  "searchQuery": "Tel Aviv",
  "resultsCount": 1,
  "selectedLocation": {
    "name": "Tel Aviv",
    "en": "Tel Aviv",
    "he": "תל אביב",
    "lat": 32.0853,
    "lng": 34.7818
  },
  "language": "th"
}
```

**Response:**

```json
{
  "success": true,
  "id": "507f1f77bcf86cd799439011",
  "message": "Search logged successfully"
}
```

### Get Search Analytics

```http
GET /api/analytics/searches?days=30
```

**Response:**

```json
{
  "period": "30 days",
  "since": "2025-10-15T00:00:00.000Z",
  "summary": {
    "totalSearches": 1250,
    "noResultsCount": 45,
    "noResultsPercentage": 4,
    "uniqueQueries": 320
  },
  "topQueries": [
    {
      "query": "Tel Aviv",
      "count": 185
    },
    {
      "query": "Haifa",
      "count": 142
    }
  ],
  "topLocations": [
    {
      "name": "Tel Aviv",
      "nameHe": "תל אביב",
      "count": 165,
      "latitude": 32.0853,
      "longitude": 34.7818
    }
  ],
  "languageDistribution": [
    {
      "_id": "th",
      "count": 980
    },
    {
      "_id": "en",
      "count": 270
    }
  ],
  "dailyActivity": [
    {
      "_id": "2025-11-01",
      "count": 45
    }
  ],
  "generatedAt": "2025-11-14T14:00:00.000Z"
}
```

## Frontend Implementation

The search logging is automatically triggered:

1. **When user performs a search:**

   - Logs the search query and number of results

2. **When user selects a location:**
   - Updates the log with the selected location details

The implementation is silent and doesn't interrupt the user experience. Failed logging attempts are caught and logged to console without affecting functionality.

## Use Cases

### 1. Understanding User Intent

- Identify most searched locations
- Discover search patterns
- Find queries with no results (potential data gaps)

### 2. Data Quality Improvement

- Find misspellings or alternative names for locations
- Identify missing cities or regions in the database
- Understand which locations Thai workers are most interested in

### 3. Language Analysis

- Track Thai vs English usage
- Identify translation needs

### 4. Future Features

- Autocomplete suggestions based on popular searches
- "Did you mean?" functionality for misspelled queries
- Trending locations dashboard

## Privacy Considerations

- Only search queries and selected locations are stored
- IP addresses are hashed/anonymized in production
- No personal identifying information is collected
- Data is used solely for improving the service for Thai migrant workers

## Example Queries

### Get most popular search terms (last 7 days)

```bash
curl http://localhost:3001/api/analytics/searches?days=7
```

### MongoDB query for searches with no results

```javascript
db.getCollection("search-logs")
  .find({
    resultsCount: 0,
    createdAt: { $gte: new Date("2025-11-01") },
  })
  .sort({ createdAt: -1 });
```

### Find all searches for a specific location

```javascript
db.getCollection("search-logs")
  .find({
    "selectedLocation.nameEn": "Tel Aviv",
  })
  .count();
```

## Environment Variables

```env
# MongoDB connection string (required)
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/

# API URL for frontend (optional, defaults to localhost:3001)
REACT_APP_API_URL=http://localhost:3001
```

## Future Enhancements

1. **Search Suggestions**: Auto-complete based on popular queries
2. **Spell Check**: Suggest corrections for misspelled city names
3. **Trending Locations**: Show most searched locations in real-time
4. **Heatmap**: Visualize search popularity by region
5. **Export**: Download search data for analysis

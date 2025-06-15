# 🛡️ Thai Migrant Worker Safety Alert System

A comprehensive safety monitoring system for Thai migrant workers in Israel, featuring real-time Iron Dome alert tracking, location-based safety analysis, and emergency contact information.

## 🌟 Features

### Core Safety Features

- **Real-time Iron Dome Alert Monitoring**: Live tracking of missile alerts across Israel
- **Location-based Safety Analysis**: GPS-based safety assessment for current location
- **Bilingual Support**: Full Thai and English language support
- **Emergency Contacts**: Quick access to emergency numbers and Thai consulate information

### Advanced Monitoring

- **Location Logging**: Anonymous GPS tracking for research on Thai worker distribution
- **Safety Analytics**: Historical data analysis and geospatial mapping
- **GeoJSON Export**: Data export capability for research purposes
- **Alert History**: Historical alert tracking and analysis

## 🏗️ Architecture

### Frontend (React)

- **Location**: `frontend/`
- **Framework**: React.js with hooks
- **Map Integration**: Leaflet.js for interactive mapping
- **Responsive Design**: Mobile-first approach
- **Deployment**: Vercel-ready configuration

### Backend (Node.js)

- **Location**: `backend/`
- **Framework**: Express.js proxy server
- **Database**: MongoDB Atlas integration
- **Features**: Location logging, data analysis
- **Deployment**: Railway-ready configuration

### Data Management

- **Location Logging**: MongoDB collection for anonymous GPS data
- **GeoJSON Storage**: Spatial data for mapping
- **Alert API Integration**: Real-time alert data fetching

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (for location logging)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/visarutforthaipbs/thai-migrant-rocket-safe.git
   cd thai-migrant-rocket-safe
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd frontend && npm install && cd ..

   # Install backend dependencies
   cd backend && npm install && cd ..
   ```

3. **Environment Configuration**

   ```bash
   # Backend environment
   cp backend/.env.example backend/.env
   # Edit backend/.env with your MongoDB connection string
   ```

4. **Development**

   ```bash
   # Run frontend (development)
   cd frontend && npm start

   # Run backend (separate terminal)
   cd backend && node proxy-server.js

   # Or run both with npm scripts from root
   npm run dev:frontend
   npm run dev:backend
   ```

## 📱 Deployment

### Frontend (Vercel)

The frontend is configured for Vercel deployment:

- Configuration: `frontend/vercel.json`
- Auto-deploy from `main` branch
- Environment variables set in Vercel dashboard

### Backend (Railway)

The backend is configured for Railway deployment:

- Configuration: `backend/railway.json`
- MongoDB Atlas connection
- Environment variables set in Railway dashboard

## 🗺️ Features Deep Dive

### Location Safety Check

- Users can check if their current location is safe
- GPS coordinates are analyzed against alert zones
- Results are logged anonymously for research

### Alert Monitoring

- Real-time integration with Israeli alert systems
- Visual indicators for different threat levels
- Historical alert data tracking

### Data Analytics

- Location distribution analysis
- Safety pattern identification
- GeoJSON export for research
- Anonymous data collection for policy research

## 🔧 Development Scripts

```bash
# Root level scripts
npm run dev:frontend      # Start frontend development server
npm run dev:backend       # Start backend proxy server
npm run analyze-locations # Run location data analysis

# Frontend scripts
npm start                 # Development server
npm run build            # Production build
npm run deploy           # Deploy to Vercel

# Backend scripts
node proxy-server.js     # Start proxy server
```

## 📊 Data & Privacy

### Location Logging

- **Anonymous**: No personal identification stored
- **Minimal Data**: Only coordinates, timestamp, and safety status
- **Research Purpose**: Data used for understanding Thai worker distribution
- **Privacy First**: No tracking of individual users

### Database Schema

```javascript
{
  coordinates: [longitude, latitude],
  timestamp: Date,
  safetyStatus: String,
  alertCount: Number,
  userAgent: String (browser info only)
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is created for humanitarian purposes to help Thai migrant workers stay safe in Israel.

## 🆘 Emergency Contacts

- **Israeli Emergency**: 101
- **Thai Consulate in Israel**: 054-636-8150
- **Thai Ministry of Foreign Affairs**: +66-2-643-5333

## 🙏 Acknowledgments

- Israeli alert system data providers
- Thai Ministry of Foreign Affairs
- OpenStreetMap contributors
- MongoDB Atlas for database hosting
- Vercel and Railway for deployment platforms

---

**Note**: This system is designed to complement, not replace, official emergency alert systems. Always follow official emergency procedures and local authorities' guidance.

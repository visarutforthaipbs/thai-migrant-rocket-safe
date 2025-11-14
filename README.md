# 🇹🇭🇮🇱 Thai Migrant Rocket Safe - Complete Safety System

A comprehensive safety monitor## 📱 User Experience & Use Cases

### 🚨 For Thai Workers in Active Emergency Situations:

**Using Emergency Alert Map (`/`)**

1. **Immediate Threat Assessment** - Check if your current location has active alerts
2. **Emergency Navigation** - Find nearest shelters and safe evacuation routes
3. **Crisis Communication** - One-click access to Thai consulate emergency hotline
4. **Real-time Updates** - Stay informed about changing threat levels in your area

### 🛡️ For Newly Arrived Thai Migrant Workers:

**Using Safety Assessment Center (`/safety-check`)**

1. **Area Orientation** - Learn about the safety profile of your new work location
2. **Housing Safety Assessment** - Understand risks around your accommodation
3. **Workplace Risk Education** - Know the safety history of your work site
4. **Long-term Safety Planning** - Understand seasonal patterns and local emergency procedures

### 📊 For Thai Authorities & Civil Society Organizations:

**Using Situational Assessment Dashboard (`/dashboard`)**

1. **Population Monitoring** - Track safety status of Thai worker communities
2. **Resource Planning** - Identify areas needing consulate services or safety programs
3. **Policy Development** - Use data to create targeted safety policies
4. **Emergency Preparedness** - Plan evacuation routes and emergency response strategiesifically designed for Thai migrant workers in Israel during times of conflict and security threats. It provides real-time safety information, location-based risk assessment, and emergency resources.

## 🎯 What It Does

**Thai Migrant Rocket Safe** is a life-saving digital safety net that combines real-time Iron Dome alert monitoring with practical safety tools and emergency resources, specifically designed for the Thai migrant worker community in Israel.

## 🌟 Core Features & Pages

### 1. � Emergency Alert Map (`/`) - **SHORT-TERM URGENT RESPONSE**

**Target Users**: Thai workers currently in Israel during active threats  
**Purpose**: Immediate emergency awareness and rapid response to ongoing security threats

- **Real-time Iron Dome Alert Monitoring** - Live missile/rocket alert tracking with immediate notifications
- **Interactive Emergency Map** with critical layers:
  - **Active Alert Zones** - Current danger areas with color-coded severity levels
  - **Evacuation Routes** - Safe passage recommendations
  - **Shelter Locations** - Nearest protected spaces
  - **Risk Hotspots** - Areas to avoid immediately
- **Emergency Contact Bar** - One-click access to Thai consulate and emergency services (100, 101, 102)
- **Bilingual Emergency Interface** - Critical information in Thai and English
- **Time-sensitive Filtering** - Focus on immediate threats (last few hours)

_Goal: Save lives through immediate situational awareness during active security events_

### 2. 🛡️ Safety Assessment Center (`/safety-check`) - **LONG-TERM AREA FAMILIARIZATION**

**Target Users**: Newly arrived Thai migrant workers learning about their work location  
**Purpose**: Comprehensive area safety education and long-term risk awareness

- **Location Learning System**:
  - **GPS Area Analysis** - Understand your new neighborhood's safety profile
  - **Manual Coordinate Education** - Learn about specific work sites or housing areas
- **Comprehensive Safety Education**:
  - **Historical Alert Patterns** - Learn about past security incidents in the area
  - **Seasonal Risk Trends** - Understand how threats change over time
  - **Area Risk Classification** - Detailed explanation of why an area is rated as safe/risky
  - **Local Safety Protocols** - Area-specific emergency procedures and shelter locations
- **Educational Safety Recommendations** - Detailed guidance for living and working safely in the area
- **Progress Tracking** - Record of areas you've learned about for future reference

_Goal: Educate new arrivals about long-term safety considerations for their work and living locations_

### 3. 📊 Situational Assessment Dashboard (`/dashboard`) - **STRATEGIC OVERSIGHT & POLICY**

**Target Users**: Thai government officials, consulate staff, NGOs, and civil society organizations  
**Purpose**: Strategic assessment of Thai worker safety for policy decisions and resource allocation

- **Population Safety Overview** (Israel-wide analytics):
  - **Worker Distribution Analysis** - Where Thai workers are located across Israel
  - **Risk Exposure Statistics** - How many workers are in different risk categories
  - **Vulnerability Assessment** - Identification of high-risk worker populations
- **Strategic Intelligence**:
  - **Geographic Risk Mapping** - Areas where Thai workers face highest threats
  - **Temporal Threat Analysis** - When and where incidents occur most frequently
  - **Resource Allocation Insights** - Where to focus consulate services and safety resources
- **Policy Support Data**:
  - **Evacuation Planning** - Data for emergency evacuation procedures
  - **Consulate Service Optimization** - Understanding where workers need most support
  - **Safety Campaign Targeting** - Identify areas needing safety education

_Goal: Provide Thai authorities and civil society with data-driven insights for protecting Thai worker communities_

## 🏗️ Technical Architecture

### Frontend (React.js)

- **Location**: `frontend/` directory
- **Framework**: React with hooks, React Router
- **Maps**: Leaflet.js integration
- **Styling**: Custom CSS with Thai fonts
- **Deployment**: Vercel-ready
- **URL**: http://localhost:3000

### Backend (Node.js)

- **Location**: `backend/` directory
- **Framework**: Express.js proxy server
- **Database**: MongoDB Atlas
- **APIs**:
  - `/api/alerts` - Real-time Iron Dome data
  - `/api/dashboard/analytics` - Safety analytics
  - `/api/dashboard/recent-checks` - Location logs
  - `/api/log-location` - Location data collection
- **Deployment**: Railway-ready
- **URL**: http://localhost:3001

### Database (MongoDB)

- **Location Logs Collection**: Geographic data with Israel filtering
- **Geographic Indexing**: Efficient location queries
- **Anonymous Tracking**: Privacy-focused data collection

## � User Experience

### For Thai Migrant Workers:

1. **Check Current Safety** - Use GPS or enter coordinates to get instant safety assessment
2. **View Alert Map** - See real-time missile/rocket alerts across Israel
3. **Access Emergency Info** - Quick contact to Thai consulate and emergency services
4. **Language Choice** - Full Thai language support for accessibility

### For Administrators/Researchers:

1. **Monitor Thai Worker Safety** - Dashboard analytics showing how many workers are in risk areas
2. **Geographic Analysis** - Understanding where Thai workers are checking their safety
3. **Trend Analysis** - Daily patterns and historical safety data
4. **Risk Assessment** - Identifying high-risk areas for Thai worker populations

## 🎯 Safety Categories

- ✅ **Safe** - No recent alerts in area
- 🟡 **Low Risk** - Minimal historical activity
- 🟠 **Moderate Risk** - Some historical alerts
- 🔴 **High Risk** - Recent alert activity
- 🚨 **Very High Risk** - Active alert zone

## 🌍 Real-World Impact

**The system serves as a critical safety tool for Thai migrant workers in Israel by:**

1. **Providing Real-time Awareness** - Workers know immediately if their area has security threats
2. **Language Accessibility** - Thai language support removes communication barriers
3. **Emergency Preparedness** - Quick access to emergency contacts and procedures
4. **Data-Driven Safety** - Analytics help understand patterns and improve safety measures
5. **Research Value** - Anonymous location data helps authorities understand Thai worker distribution and safety needs

This is essentially a **life-saving digital safety net** specifically designed for the Thai migrant worker community in Israel, combining real-time security alerts with practical safety tools and emergency resources. 🛡️

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
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**

   ```bash
   # Backend - Create .env file
   cd backend
   cp .env.example .env
   # Edit .env with your MongoDB Atlas connection string
   ```

4. **Start the application**

   ```bash
   # Start backend (Terminal 1)
   cd backend
   npm start

   # Start frontend (Terminal 2)
   cd frontend
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 📊 API Endpoints

### Safety & Analytics

- `GET /api/alerts` - Real-time Iron Dome alerts
- `GET /api/dashboard/analytics` - Safety statistics (Israel-filtered)
- `GET /api/dashboard/recent-checks` - Recent location checks
- `POST /api/log-location` - Log safety check location

### Geographic Filtering

The system automatically filters data to include only locations within Israel's boundaries:

- **North**: 33.4°N (Lebanon border)
- **South**: 29.4°N (Egypt/Red Sea border)
- **East**: 35.9°E (Jordan River/Dead Sea)
- **West**: 34.2°E (Mediterranean Sea)

## 🚀 Deployment

### Frontend (Vercel)

```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend (Railway)

```bash
cd backend
# Configure railway.json
# Deploy to Railway with MongoDB Atlas connection
```

## 📋 Project Structure

```
thai-migrant-rocket-safe/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Application pages
│   │   ├── context/        # React context
│   │   └── App.js          # Main app component
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                 # Express.js server
│   ├── proxy-server.js     # Main server file
│   ├── package.json        # Backend dependencies
│   └── railway.json        # Railway deployment config
├── docs/                   # Documentation
├── scripts/                # Utility scripts
└── README.md              # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please contact:

- **Thai Consulate in Israel**: Emergency contact information available in the app
- **Technical Issues**: Open an issue on GitHub
- **Emergency**: Use local emergency services (100, 101, 102)

---

**🇹🇭 Built with care for the Thai migrant worker community in Israel 🇮🇱**

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

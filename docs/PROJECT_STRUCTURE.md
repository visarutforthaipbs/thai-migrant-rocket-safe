# Project Structure

This document outlines the complete structure of the Iron Dome Alert System after the monorepo restructuring.

## 📁 Directory Structure

```
rocket-1/                           # Root monorepo directory
├── frontend/                       # React frontend application
│   ├── src/                       # React source code
│   │   ├── components/            # React components
│   │   │   ├── Footer.js         # Footer with emergency contacts
│   │   │   ├── LayerSelector.js  # Map layer selection
│   │   │   ├── Legend.js         # Map legend component
│   │   │   ├── LocationSafetyCheck.js # GPS safety checker
│   │   │   ├── MapComponent.js   # Main Leaflet map
│   │   │   ├── Navbar.js         # Navigation bar
│   │   │   ├── Sidebar.js        # Alert information sidebar
│   │   │   ├── ThaiWorkerLayer.js # Thai worker specific layer
│   │   │   └── TimeFilter.js     # Time-based filtering
│   │   ├── context/              # React context providers
│   │   │   └── DataContext.js    # Global state management
│   │   ├── App.js                # Main React application
│   │   ├── App.css               # Application styles
│   │   ├── fonts.css             # Font definitions
│   │   ├── index.js              # React entry point
│   │   └── index.css             # Global styles
│   ├── public/                   # Static assets
│   │   ├── api/                  # Client-side API helpers
│   │   ├── data/                 # Static data files
│   │   ├── font/                 # Font files
│   │   ├── static/               # JSON data files
│   │   │   ├── all.json         # Historical alert data
│   │   │   ├── cities.json      # City metadata
│   │   │   └── polygons.json    # Geographic boundaries
│   │   └── index.html           # HTML template
│   ├── package.json             # Frontend dependencies
│   ├── package-lock.json        # Dependency lock file
│   └── vercel.json              # Vercel deployment config
├── backend/                      # Express.js backend server
│   ├── proxy-server.js          # Main server file
│   ├── package.json             # Backend dependencies
│   ├── railway.json             # Railway deployment config
│   └── .env.example             # Environment variables template
├── shared/                       # Shared utilities
│   └── constants.js             # Common constants
├── scripts/                      # Utility scripts
│   └── analyze-locations.js     # Location data analysis
├── docs/                         # Documentation
│   ├── README.md                # Main project documentation
│   ├── DEPLOYMENT.md            # Deployment guide
│   ├── LOCATION_LOGGING.md      # Location logging details
│   └── PROJECT_STRUCTURE.md     # This file
├── package.json                 # Root monorepo configuration
├── package-lock.json            # Root dependency lock
└── .gitignore                   # Git ignore rules
```

## 🏗️ Architecture Overview

### Frontend (React + Leaflet)

- **Framework**: React 18 with functional components and hooks
- **Mapping**: Leaflet with React-Leaflet integration
- **State Management**: React Context API
- **Styling**: CSS with responsive design
- **Build Tool**: Create React App
- **Deployment**: Vercel (static hosting)

### Backend (Express.js)

- **Framework**: Express.js with Node.js
- **Database**: MongoDB Atlas with geospatial indexing
- **API**: RESTful endpoints for alerts and location logging
- **Middleware**: CORS, JSON parsing, error handling
- **Deployment**: Railway (container hosting)

### Database (MongoDB Atlas)

- **Collections**:
  - `location-logs`: Anonymous GPS coordinates and safety data
  - `alert-history`: Historical alert records (optional)
- **Indexing**: 2dsphere geospatial index for location queries
- **Security**: Connection string with authentication

## 🔄 Data Flow

1. **Alert Data**: External API → Backend Proxy → Frontend
2. **Location Data**: Frontend GPS → Backend API → MongoDB Atlas
3. **Safety Analysis**: Frontend processes historical data locally
4. **User Interface**: React components render map and alerts

## 🚀 Development Workflow

### Local Development

```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend
npm run dev

# Frontend only (port 3000)
cd frontend && npm start

# Backend only (port 3001)
cd backend && npm run dev
```

### Production Build

```bash
# Build frontend for production
npm run build

# Start backend in production mode
npm run start
```

## 📦 Package Management

### Root Level (Monorepo)

- **Purpose**: Orchestrate frontend and backend development
- **Key Dependencies**: `concurrently` for running multiple processes
- **Scripts**: Combined development and build commands

### Frontend Package

- **Purpose**: React application with mapping capabilities
- **Key Dependencies**:
  - `react`, `react-dom` - Core React
  - `leaflet`, `react-leaflet` - Mapping
  - `react-scripts` - Build tooling
- **Proxy**: Configured to proxy API calls to backend

### Backend Package

- **Purpose**: Express.js server with database integration
- **Key Dependencies**:
  - `express` - Web framework
  - `cors` - Cross-origin resource sharing
  - `mongodb` - Database driver
  - `dotenv` - Environment variables
  - `axios` - HTTP client (if needed)

## 🌍 Environment Configuration

### Development

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- Database: MongoDB Atlas (cloud)

### Production

- Frontend: Vercel deployment
- Backend: Railway deployment
- Database: MongoDB Atlas (cloud)

## 🔒 Security Considerations

### Environment Variables

- Never commit `.env` files
- Use platform-specific environment variable settings
- Rotate database credentials regularly

### CORS Configuration

- Restrict origins to known domains
- Enable credentials for authenticated requests
- Use HTTPS in production

### Data Privacy

- Anonymous location logging
- No personally identifiable information stored
- Geospatial data aggregation for research

## 📊 Monitoring and Analytics

### Application Monitoring

- Railway: Backend performance metrics
- Vercel: Frontend analytics and performance
- MongoDB Atlas: Database performance and usage

### Error Tracking

- Backend: Console logging with timestamps
- Frontend: Browser console and error boundaries
- Database: Connection and query error logging

## 🔧 Customization Points

### Adding New Features

1. **Frontend Components**: Add to `frontend/src/components/`
2. **Backend Endpoints**: Add to `backend/proxy-server.js`
3. **Shared Utilities**: Add to `shared/`
4. **Documentation**: Update relevant docs in `docs/`

### Configuration Changes

1. **API URLs**: Update environment variables
2. **Database Schema**: Modify MongoDB collections
3. **Deployment Settings**: Update `vercel.json` or `railway.json`
4. **Build Process**: Modify package.json scripts

## 🚨 Troubleshooting

### Common Issues

1. **Port Conflicts**: Check if ports 3000/3001 are available
2. **Database Connection**: Verify MongoDB connection string
3. **CORS Errors**: Check origin configuration
4. **Build Failures**: Verify Node.js version compatibility

### Debug Commands

```bash
# Check backend health
curl http://localhost:3001/health

# View backend logs
cd backend && npm run dev

# Build frontend locally
cd frontend && npm run build

# Analyze bundle size
cd frontend && npm run build && npx serve -s build
```

## 📈 Scaling Considerations

### Performance Optimization

- Frontend: Code splitting, lazy loading, image optimization
- Backend: Caching, rate limiting, connection pooling
- Database: Indexing, query optimization, sharding

### Infrastructure Scaling

- Frontend: CDN distribution, edge caching
- Backend: Horizontal scaling, load balancing
- Database: Replica sets, sharding, read replicas

---

This structure provides a solid foundation for the Iron Dome Alert System while maintaining clear separation of concerns and enabling independent deployment of frontend and backend components.

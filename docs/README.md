# Iron Dome Alert System for Thai Migrant Workers

A real-time alert system that helps Thai migrant workers in Israel stay safe during rocket attacks by providing Iron Dome alerts in Thai language with location-based safety information.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd rocket-1
   ```

2. **Install all dependencies**

   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   ```bash
   # Copy example files
   cp backend/.env.example backend/.env

   # Edit backend/.env with your MongoDB connection string
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

This will start:

- Frontend (React): http://localhost:3000
- Backend (Express): http://localhost:3001

## 📁 Project Structure

```
rocket-1/
├── frontend/          # React application
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # Express.js proxy server
│   ├── proxy-server.js
│   └── package.json
├── shared/            # Shared utilities and constants
├── scripts/           # Analysis and utility scripts
├── docs/              # Documentation
└── package.json       # Root monorepo configuration
```

## 🛠 Available Scripts

### Root Level

- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build frontend for production
- `npm run start` - Start backend in production mode
- `npm run analyze-locations` - Run location analysis script

### Frontend Only

- `cd frontend && npm start` - Start React development server
- `cd frontend && npm run build` - Build React app for production

### Backend Only

- `cd backend && npm run dev` - Start Express server with nodemon
- `cd backend && npm start` - Start Express server in production

## 🌍 Features

- **Real-time Iron Dome Alerts**: Live alerts from official Israeli sources
- **Thai Language Support**: Full interface in Thai with English fallback
- **Location-based Safety**: GPS-based safety checking and recommendations
- **Mobile Responsive**: Optimized for mobile devices used by migrant workers
- **Anonymous Location Logging**: Privacy-focused data collection for research
- **Interactive Map**: Visual representation of alert zones and safe areas

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `build`
4. Deploy

### Backend (Railway)

1. Connect your GitHub repository to Railway
2. Set start command: `npm start`
3. Add environment variables
4. Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📊 Location Logging

The system includes anonymous location logging for research purposes. See [LOCATION_LOGGING.md](./LOCATION_LOGGING.md) for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For technical support or questions about the system, please open an issue on GitHub.

---

**Important**: This system is designed to help save lives. Please ensure all changes are thoroughly tested before deployment.

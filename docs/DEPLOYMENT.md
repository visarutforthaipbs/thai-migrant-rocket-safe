# Deployment Guide

This guide covers deploying the Iron Dome Alert System using the recommended Vercel + Railway setup.

## 🏗️ Architecture Overview

- **Frontend**: React app deployed on Vercel
- **Backend**: Express.js proxy server deployed on Railway
- **Database**: MongoDB Atlas (cloud)
- **Domain**: Custom domain through Vercel

## 🚀 Frontend Deployment (Vercel)

### Prerequisites

- GitHub repository
- Vercel account
- Custom domain (optional)

### Step 1: Prepare Frontend

```bash
cd frontend
npm run build
```

### Step 2: Deploy to Vercel

1. **Connect Repository**

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend` directory as root

2. **Configure Build Settings**

   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

3. **Environment Variables**

   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   REACT_APP_ENVIRONMENT=production
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build completion
   - Your app will be available at `https://your-app.vercel.app`

### Step 3: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Enable HTTPS (automatic)

## 🚂 Backend Deployment (Railway)

### Prerequisites

- GitHub repository
- Railway account
- MongoDB Atlas connection string

### Step 1: Prepare Backend

```bash
cd backend
npm install
```

### Step 2: Deploy to Railway

1. **Connect Repository**

   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `backend` directory

2. **Configure Environment Variables**

   ```
   NODE_ENV=production
   PORT=3001
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rocket-migrant-safe
   ALERT_API_URL=https://www.tzevaadom.co.il/WarningMessages/alert/alerts.json
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   ```

3. **Configure Build Settings**

   - Start Command: `npm start`
   - Build Command: `npm install`

4. **Deploy**
   - Railway will automatically deploy
   - Your API will be available at `https://your-app.railway.app`

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create Cluster

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create new cluster (free tier available)
3. Configure network access (allow all IPs: 0.0.0.0/0)
4. Create database user

### Step 2: Configure Database

1. Create database: `rocket-migrant-safe`
2. Create collections:
   - `location-logs`
   - `alert-history`

### Step 3: Get Connection String

1. Go to Cluster → Connect
2. Choose "Connect your application"
3. Copy connection string
4. Replace `<password>` with your database user password

## 🔧 Configuration Updates

### Update API URLs

After deployment, update the frontend to use the production backend URL:

```javascript
// In frontend/src/components/LocationSafetyCheck.js
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
```

### Update CORS Settings

In your backend, update CORS to allow your frontend domain:

```javascript
// In backend/proxy-server.js
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
};
```

## 🔍 Health Checks

### Backend Health Check

Add a health check endpoint to your backend:

```javascript
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  });
});
```

### Frontend Health Check

Vercel automatically provides health checks for static sites.

## 📊 Monitoring Setup

### Railway Monitoring

1. Go to your Railway project
2. Click on "Metrics" tab
3. Monitor CPU, Memory, and Network usage
4. Set up alerts for high resource usage

### Vercel Analytics

1. Go to your Vercel project
2. Enable Analytics in project settings
3. Monitor page views and performance

### MongoDB Atlas Monitoring

1. Go to your Atlas cluster
2. Check "Metrics" tab
3. Monitor database performance
4. Set up alerts for connection issues

## 🔒 Security Configuration

### Environment Variables Security

- Never commit `.env` files
- Use Railway/Vercel environment variable settings
- Rotate MongoDB passwords regularly

### HTTPS Configuration

- Vercel: Automatic HTTPS
- Railway: Automatic HTTPS
- MongoDB Atlas: TLS/SSL enabled by default

### CORS Security

```javascript
const corsOptions = {
  origin: ["https://your-domain.com", "https://your-domain.vercel.app"],
  credentials: true,
  optionsSuccessStatus: 200,
};
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**

   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for syntax errors

2. **API Connection Issues**

   - Verify CORS settings
   - Check environment variables
   - Ensure backend is deployed and running

3. **Database Connection Issues**
   - Verify MongoDB connection string
   - Check network access settings
   - Ensure database user has correct permissions

### Debug Commands

```bash
# Check backend logs
railway logs

# Check frontend build
vercel logs

# Test API endpoints
curl https://your-backend.railway.app/health
```

## 📋 Deployment Checklist

### Pre-deployment

- [ ] All environment variables configured
- [ ] MongoDB Atlas cluster created and configured
- [ ] Frontend builds successfully locally
- [ ] Backend starts successfully locally
- [ ] API endpoints tested

### Deployment

- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set in both platforms
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS enabled

### Post-deployment

- [ ] Health checks passing
- [ ] API endpoints accessible
- [ ] Frontend loads correctly
- [ ] Database connections working
- [ ] Monitoring set up
- [ ] Alerts configured

## 🔄 CI/CD Setup (Optional)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: cd frontend && npm install && npm run build

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: cd backend && npm install
```

## 💰 Cost Estimation

### Free Tier Limits

- **Vercel**: 100GB bandwidth, unlimited static sites
- **Railway**: $5/month after free trial
- **MongoDB Atlas**: 512MB storage (free tier)

### Scaling Costs

- **Vercel Pro**: $20/month per member
- **Railway**: Pay-per-use after free tier
- **MongoDB Atlas**: $9/month for 2GB (M2 cluster)

---

**Note**: This deployment setup is designed for production use with high availability and security. For development or testing, you can use the local development setup described in the main README.

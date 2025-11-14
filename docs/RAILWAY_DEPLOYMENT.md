# Railway Environment Variables Setup

## Required Environment Variables for Railway Deployment

### Core Variables

```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://sankhamphotography:dVRUHUlvsf0g7C1S@rocket-migrant-safe.7ouw6za.mongodb.net/rocket-migrant-safe?retryWrites=true&w=majority

# Server Configuration
PORT=3001
NODE_ENV=production

# API Configuration
ALERT_API_URL=https://www.tzevaadom.co.il/static/historical/all.json

# CORS Configuration (Important for Railway)
CORS_ORIGIN=https://thai-migrant-rocket-safe-frontend-4.vercel.app

# Optional: Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Railway Deployment Notes

1. **Environment Variables**: Set these in Railway Dashboard → Your Service → Variables
2. **Health Check**: Railway expects `/health` endpoint to return 200 status
3. **Port**: Railway provides PORT environment variable automatically
4. **Build**: Uses Nixpacks, should auto-detect Node.js project

## Common Issues and Solutions

### Healthcheck Timeout

- Current timeout: 100s (in railway.json)
- MongoDB connection might be slow on first startup
- Consider increasing timeout if needed

### MongoDB Connection

- Ensure IP whitelist includes Railway IPs (0.0.0.0/0 for development)
- Verify connection string includes database name
- Check network access in MongoDB Atlas

### CORS Issues

- Update CORS_ORIGIN to match your frontend domain
- Add Railway preview domains if needed

## Testing Deployment

1. Deploy to Railway
2. Check logs for any connection errors
3. Test health endpoint: `curl https://your-railway-app.railway.app/health`
4. Test API endpoint: `curl https://your-railway-app.railway.app/api/alerts`

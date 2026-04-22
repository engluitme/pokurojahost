# Render Environment Setup Guide

## Quick Setup Instructions

### Option 1: Render Dashboard (Recommended)
1. Go to your Render service dashboard
2. Click **"Environment"** tab
3. Add each environment variable by clicking **"Add"**
4. Paste each variable name and value:

```
ADMIN_EMAIL = admin@pokuroja.com
ADMIN_PASSWORD = admin123
CLOUDINARY_API_KEY = 675516114524873
CLOUDINARY_API_SECRET = sNNcF9GRgTZOyNAojtjNddjhr-w
CLOUDINARY_CLOUD_NAME = dwnhtjsrw
JWT_SECRET = d1f4a2b8c6e9f0a3d5c7b9e2f1a4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8
MONGO_DB_NAME = pokurojahouses
MONGO_URI = mongodb+srv://pokurojahouses:pokuroja123@cluster0.jiamdgm.mongodb.net/pokuroja?retryWrites=true&w=majority
NODE_ENV = production
PORT = 10000
```

5. Click **"Save"** - Render will automatically redeploy with new variables

### Option 2: Local Development
Use the `.env` file in `pokurojahouses-main/backend/` for local testing:
```bash
npm start
```

## What Each Variable Does

| Variable | Purpose |
|----------|---------|
| `ADMIN_EMAIL` | Admin login email address |
| `ADMIN_PASSWORD` | Admin login password |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud for image uploads |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `JWT_SECRET` | JWT token signing secret |
| `MONGO_URI` | MongoDB connection string |
| `MONGO_DB_NAME` | MongoDB database name |
| `NODE_ENV` | Set to `production` for live |
| `PORT` | Server port (Render uses 10000) |

## Security Notes
⚠️ **WARNING**: Never commit `.env` file to Git!
- `.env` files are already in `.gitignore`
- `.env.example` shows the structure without secrets
- Store actual secrets only in Render dashboard

## Deployment Steps
1. Push your code to GitHub: `git push origin main`
2. Set environment variables in Render dashboard
3. Render will automatically rebuild and deploy
4. Check logs to verify successful startup

## Test Your Deployment
Once deployed, test these endpoints:

```bash
# Health check
curl https://your-service.onrender.com/api/health

# Admin login
curl -X POST https://your-service.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pokuroja.com","password":"admin123"}'
```

## Updating Variables
To update any variable:
1. Go to Render dashboard
2. Click service → Environment
3. Edit the variable
4. Save (automatic redeploy)

## Troubleshooting
- **Server won't start**: Check all variables are set in Render
- **MongoDB connection fails**: Verify MONGO_URI is correct
- **Login fails**: Verify ADMIN_EMAIL and ADMIN_PASSWORD match
- **Image upload fails**: Check Cloudinary credentials

## Files Provided
- `.env` - Local development (gitignored)
- `.env.example` - Reference template
- `render.yaml` - Render deployment config

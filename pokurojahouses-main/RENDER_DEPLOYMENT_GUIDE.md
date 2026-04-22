# Render Deployment Guide for PokuRoja Houses

## Overview
This guide will help you deploy your full-stack PokuRoja Houses application to Render with:
- **Backend API** (Node.js + Express + MongoDB)
- **Frontend** (Static HTML/CSS/JS)
- **Admin Panel** (Integrated with backend)

## Prerequisites
- Render account (free tier available)
- MongoDB Atlas database (or any MongoDB instance)
- Git repository (GitHub recommended)

## Project Structure
```
pokuroja-houses/
├── backend/           # Node.js API server
├── admin/            # Admin panel (served by backend)
├── index.html        # Main frontend
├── listings.html     # Property listings
├── css/             # Stylesheets
├── js/              # Frontend JavaScript
├── img/             # Images
└── render.yaml      # Render deployment config
```

## Deployment Steps

### Step 1: Prepare Your Repository
1. **Push your code to GitHub** (or GitLab/Bitbucket)
2. **Ensure all files are committed**:
   ```bash
   git add .
   git commit -m "Ready for Render deployment"
   git push origin main
   ```

### Step 2: Connect to Render
1. Go to [render.com](https://render.com) and sign up/login
2. Click **"New"** → **"Blueprint"**
3. Connect your Git repository
4. Render will detect the `render.yaml` file

### Step 3: Configure Environment Variables
In your Render dashboard, set these environment variables for the **backend service**:

**Required Variables:**
```
MONGO_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/pokurojahouses?retryWrites=true&w=majority
MONGO_DB_NAME=pokurojahouses
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
ADMIN_EMAIL=admin@pokuroja.com
ADMIN_PASSWORD=your-secure-admin-password
NODE_ENV=production
```

### Step 4: Deploy
1. Click **"Create Blueprint"** in Render
2. Render will automatically:
   - Create the backend web service
   - Create the frontend static site
   - Set up the services according to `render.yaml`
3. Wait for deployment to complete (usually 5-10 minutes)

### Step 5: Access Your Application
After deployment, you'll get two URLs:
- **Frontend**: `https://your-app-name.onrender.com`
- **Backend API**: `https://your-backend-name.onrender.com`

## Configuration Details

### render.yaml Breakdown
```yaml
services:
  # Backend API Service
  - type: web
    name: pokuroja-backend
    runtime: node
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start

  # Frontend Static Site
  - type: web
    name: pokuroja-frontend
    runtime: static
    staticPublishPath: ./
```

### Environment Variables
- `NODE_ENV=production` - Enables production mode
- `PORT=10000` - Render's default port (auto-configured)
- Database and auth variables as shown above

## Admin Panel Access
Once deployed, access the admin panel at:
```
https://your-frontend-url.onrender.com/admin/login.html
```

Login with:
- **Email**: admin@pokuroja.com
- **Password**: (whatever you set in ADMIN_PASSWORD)

## Troubleshooting

### Common Issues
1. **Build fails**: Check that `backend/package.json` has correct dependencies
2. **Database connection fails**: Verify MONGO_URI is correct
3. **Admin login fails**: Check JWT_SECRET and ADMIN_PASSWORD
4. **Static files not loading**: Ensure file paths are correct in HTML

### Logs
- Check Render service logs for detailed error messages
- Use `/api/health` endpoint to test backend connectivity

### File Uploads
Note: Render's free tier doesn't persist file uploads. For production, consider:
- Cloud storage (AWS S3, Cloudinary)
- Paid Render plan with persistent disks
- External file hosting service

## Updating Your Deployment
After making changes:
1. Commit and push to your repository
2. Render will automatically redeploy
3. Or manually trigger redeploy in Render dashboard

## Cost Estimate
- **Free Tier**: 750 hours/month combined
- **Backend Web Service**: ~50-100 hours/month
- **Static Site**: ~10-20 hours/month
- **MongoDB Atlas**: Free tier available

## Next Steps
1. Set up custom domain (optional)
2. Configure monitoring/alerts
3. Set up backup strategy for database
4. Consider CDN for static assets
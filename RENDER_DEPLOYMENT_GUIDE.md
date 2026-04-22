# Render Deployment Guide for PokuRoja Houses

## Quick Start
This project is now configured for Render deployment. Follow these steps to deploy your application.

## Prerequisites
- Render account (free tier available at [render.com](https://render.com))
- MongoDB Atlas database or any MongoDB instance
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### Step 1: Connect Your Repository
1. Go to [render.com](https://render.com) and log in
2. Click **"New"** → **"Blueprint"**
3. Connect your Git repository containing this project
4. Render will auto-detect the `render.yaml` file in the root directory

### Step 2: Configure Environment Variables
Set these environment variables in your Render dashboard:

```
# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/pokurojahouses?retryWrites=true&w=majority
MONGO_DB_NAME=pokurojahouses

# Authentication
JWT_SECRET=your-long-random-secret-key-here-min-32-chars
ADMIN_EMAIL=admin@pokuroja.com
ADMIN_PASSWORD=your-secure-admin-password

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Application
NODE_ENV=production
PORT=10000
```

### Step 3: Deploy
1. Click **"Create Blueprint"** in Render
2. Render will automatically:
   - Install dependencies from `pokurojahouses-main/backend/package.json`
   - Build your application
   - Start the server
3. Deployment typically completes in 5-10 minutes

### Step 4: Access Your Application
After successful deployment:
- **Frontend URL**: `https://your-service-name.onrender.com`
- **Admin Panel**: `https://your-service-name.onrender.com/admin/login.html`
- **API**: `https://your-service-name.onrender.com/api`

## Project Structure for Render
```
pokuroja Host/
├── render.yaml                    # ← Render Blueprint configuration
├── pokurojahouses-main/           # ← Main project directory
│   ├── backend/
│   │   ├── backend/
│   │   │   └── server.js         # Express server entry point
│   │   └── package.json          # Node dependencies
│   ├── admin/                    # Admin panel files
│   ├── index.html                # Main landing page
│   ├── listings.html             # Property listings
│   └── ... (other assets)
```

## render.yaml Configuration
The `render.yaml` file defines:
- **Service name**: `pokuroja-backend`
- **Runtime**: Node.js
- **Build command**: Installs dependencies in the backend folder
- **Start command**: Runs `node backend/server.js`
- **Environment variables**: Defined in Render dashboard

## Admin Panel Access
Once deployed, log in to the admin panel:
- URL: `https://your-app.onrender.com/admin/login.html`
- Email: `admin@pokuroja.com` (or your configured email)
- Password: Your configured admin password

## Important Notes

### Database Persistence
- MongoDB Atlas: Uses cloud database (recommended for production)
- File uploads: Render free tier doesn't persist files - use Cloudinary or S3

### Resource Usage
- Free tier: 750 hours/month
- Typical app: 50-100 hours/month
- Suitable for development/testing

### Redeploys
Render automatically redeploys when you:
1. Push changes to your Git repository
2. Manually trigger a redeploy from the Render dashboard
3. Update environment variables

## Troubleshooting

### Build Fails
- Check `pokurojahouses-main/backend/package.json` for syntax errors
- Verify all dependencies are listed
- Check Node version compatibility

### Server Won't Start
- Check that `pokurojahouses-main/backend/backend/server.js` exists
- Verify environment variables are set correctly
- Check server logs in Render dashboard

### API Not Responding
- Verify MONGO_URI and database credentials
- Check MongoDB Atlas IP whitelist includes Render servers
- Test `/api/health` endpoint

### Admin Login Fails
- Verify ADMIN_EMAIL and ADMIN_PASSWORD are set
- Ensure JWT_SECRET is at least 32 characters
- Check database has user collection

## Next Steps
1. Test your deployment thoroughly
2. Set up custom domain (if needed)
3. Configure monitoring and alerts
4. Plan database backup strategy
5. Monitor logs and performance

## Support Resources
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Help](https://docs.mongodb.com/atlas)
- [Express.js Guide](https://expressjs.com/)

## Removed Files
The following deployment configurations have been removed:
- ❌ `railway.toml` (Railway configuration)
- ❌ `VERCEL_DEPLOYMENT_GUIDE.md` (Vercel documentation)

This project is now **Render-only** focused.

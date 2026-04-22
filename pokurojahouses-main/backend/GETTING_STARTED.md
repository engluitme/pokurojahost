# 🚀 Complete Setup Guide - Admin & Frontend Connected

## ✅ What Was Fixed

1. **Backend Server** - Created `.env` file with default credentials
2. **Routes** - Added missing `upload.js` route
3. **Frontend Integration** - Updated `listings.html` to load properties from API
4. **Property Details** - Updated `propertydetails.html` to fetch single properties from API
5. **Easy Startup** - Created `start-all.bat` to start both servers at once

## 🎯 Quick Start (One Command!)

Double-click this file to start everything:
```
c:\Users\eng lui\Desktop\PokuRoja Houses\start-all.bat
```

This will open **2 terminal windows**:
- **Terminal 1**: Backend API (Node.js on port 5000)
- **Terminal 2**: Website (Python http.server on port 8000)

## 📍 Access Your Project

### Admin Panel
- **Login Page**: http://localhost:5000/admin/login.html
- **Dashboard**: http://localhost:5000/admin/Dashboard.html
- **Properties List**: http://localhost:5000/admin/properties.html
- **Add Property**: http://localhost:5000/admin/addproperty.html

**Default Login Credentials:**
```
Email:    admin@pokuroja.com
Password: admin123
```

### Website
- **Home**: http://localhost:8000/index.html
- **Listings** (with API): http://localhost:8000/listings.html
- **Property Details**: http://localhost:8000/propertydetails.html
- **Contact**: http://localhost:8000/contact.html

### From Phone (Same Network)
```
http://172.22.2.210:8000
```

## 🔧 Manual Startup (If Needed)

### Terminal 1 - Backend:
```powershell
cd "c:\Users\eng lui\Desktop\PokuRoja Houses\backend"
npm start
```

### Terminal 2 - Website:
```powershell
cd "c:\Users\eng lui\Desktop\PokuRoja Houses"
python -m http.server 8000
```

## ✨ How It Works Now

```
Your Website (listings.html)
         ↓ (fetch from API)
    Backend Server (localhost:5000)
         ↓ (routes to API endpoints)
    /api/properties
```

### What Happens:
1. You visit `http://localhost:8000/listings.html`
2. Page loads and JavaScript calls: `http://localhost:5000/api/properties`
3. Backend returns all properties from database
4. Properties display on your website dynamically!
5. Click a property → goes to `propertydetails.html?id=UUID`
6. Details page fetches that specific property from API

## 🎮 Test It Out

### 1. Try Admin Panel
1. Go to: http://localhost:5000/admin/login.html
2. Login with: `admin@pokuroja.com` / `admin123`
3. Click Dashboard - should show 0 properties (empty database)
4. Click "Add Property" button
5. Fill in property details and click "Add Property"

### 2. Check Website
1. Go to: http://localhost:8000/listings.html
2. If backend is running, you should see your property!
3. Click on it to see details

## 📁 File Changes Made

**Created:**
- `backend/.env` - Environment configuration
- `backend/routes/upload.js` - Image upload handler
- `start-all.bat` - Easy startup script

**Updated:**
- `listings.html` - Added API integration
- `propertydetails.html` - Added single property API call
- `backend/admin/login.html` - Connects to real API now
- `backend/admin/Dashboard.html` - Fetches from API
- `backend/admin/properties.html` - Fetches from API
- `backend/admin/addproperty.html` - Saves to API

## 🐛 Troubleshooting

### Admin Page Not Opening
**Check**: Is backend running?
```
http://localhost:5000/api/health
Should return: {"status":"Backend is running"}
```

If not running:
```powershell
cd backend
npm start
```

### Properties Not Showing on Website
**Check**: Are both servers running?
- Backend: http://localhost:5000/api/health
- Website showing? http://localhost:8000

**Check**: Browser console for errors (F12 → Console)

### Can't Login to Admin
**Check**: Username and password in above section
- Default: `admin@pokuroja.com` / `admin123`

To change credentials, edit `backend/.env`:
```
ADMIN_EMAIL=admin@pokuroja.com
ADMIN_PASSWORD=your_new_password
```
Then restart backend.

### Database is Empty
**Expected!** You haven't added any properties yet.
1. Go to admin panel
2. Add properties
3. They'll appear on listings.html

## 🔌 Without Supabase (For Now)

Right now, properties are stored **in memory only**. When you restart the server, they're lost.

To make them permanent, connect to Supabase:
1. See: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
2. Get Supabase credentials
3. Update `backend/.env` with credentials
4. Create database tables (using SQL)

## 📚 Directory Structure

```
c:\Users\eng lui\Desktop\PokuRoja Houses\
├── start-all.bat              ← Click to start everything!
├── index.html                 ← Your website home
├── listings.html              ← Properties list (now with API!)
├── propertydetails.html       ← Single property (now with API!)
├── SUPABASE_SETUP.md         ← Database setup guide
├── SUPABASE_INTEGRATION.md   ← Advanced integration
├── QUICK_REFERENCE.md        ← Quick commands
└── backend/
    ├── .env                   ← Configuration
    ├── server.js              ← Main backend
    ├── package.json
    ├── routes/
    │   ├── auth.js            ← Login endpoints
    │   ├── properties.js       ← Property CRUD
    │   └── upload.js          ← Image uploads
    └── admin/
        ├── login.html         ← Admin login
        ├── Dashboard.html     ← Stats & overview
        ├── properties.html    ← List all properties
        ├── addproperty.html   ← Add/edit form
        ├── styles.css
        └── app.js
```

## 🎓 Next Steps

1. ✅ Test admin panel - add some properties
2. ✅ Check website - see properties appear
3. ✅ Try from phone - use `172.22.2.210:8000`
4. 🔲 Set up Supabase - for permanent storage (see SUPABASE_SETUP.md)
5. 🔲 Deploy backend - so it's always online
6. 🔲 Deploy website - to real hosting

## ❓ Questions?

- **Admin Issues**: Check console (F12)
- **API Issues**: Check `http://localhost:5000/api/health`
- **Website Issues**: Check browser console
- **Setup Issues**: See SUPABASE_SETUP.md
- **Integration Issues**: See SUPABASE_INTEGRATION.md

---

**You're all set! 🎉 Click `start-all.bat` to get started!**

# Backend Setup Guide - PokuRoja Houses

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Supabase

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your credentials:
   - Project URL
   - Anon Key
   - Service Role Key

#### Create Database Tables

Run these SQL commands in Supabase SQL Editor:

```sql
-- Create properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  address TEXT NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  area INTEGER,
  description TEXT,
  image_url TEXT,
  status VARCHAR(50) DEFAULT 'available',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-images', 'property-images', true);

-- Create storage policies
CREATE POLICY "Public Read Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated Upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Authenticated Delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'property-images');
```

### 3. Setup Environment Variables

Copy `.env.example` to `.env` and fill in:
```
SUPABASE_URL=your_project_url
SUPABASE_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key
JWT_SECRET=your_secret_key_here
ADMIN_EMAIL=admin@pokuroja.com
ADMIN_PASSWORD=your_admin_password
PORT=5000
NODE_ENV=development
```

### 4. Run the Backend Server
```bash
npm start
# or for development with auto-reload
npm run dev
```

Server will run on: **http://localhost:5000**
Admin Panel: **http://localhost:5000/admin**

## Available API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/verify` - Verify token
- `POST /api/auth/logout` - Logout

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (requires auth)
- `PUT /api/properties/:id` - Update property (requires auth)
- `DELETE /api/properties/:id` - Delete property (requires auth)

### Files
- `POST /api/upload` - Upload image (requires auth)

## Admin Panel Features

- 📊 Dashboard with statistics
- 🏠 View all properties
- ➕ Add new properties
- ✏️ Edit existing properties
- 🗑️ Delete properties
- 🖼️ Upload property images
- 🔍 Search and filter properties
- 🔐 Admin authentication

## Folder Structure

```
backend/
├── server.js                 # Express server
├── package.json             # Dependencies
├── .env.example             # Environment template
├── routes/
│   ├── auth.js             # Authentication endpoints
│   ├── properties.js       # Property CRUD endpoints
│   └── upload.js           # File upload endpoint
├── admin/
│   ├── index.html          # Admin panel UI
│   ├── styles.css          # Admin panel styles
│   └── app.js              # Admin panel logic
└── uploads/                # Local uploads (backup)
```

## Connecting Frontend to Backend

Update your website files to use the API:

### Example: Fetch properties to display
```javascript
fetch('http://localhost:5000/api/properties')
  .then(res => res.json())
  .then(properties => {
    // Display properties on your website
  });
```

## Database Schema

### properties table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Unique identifier |
| title | VARCHAR(255) | Property title |
| price | DECIMAL | Property price |
| address | TEXT | Property address |
| bedrooms | INTEGER | Number of bedrooms |
| bathrooms | INTEGER | Number of bathrooms |
| area | INTEGER | Area in sq ft |
| description | TEXT | Property description |
| image_url | TEXT | URL to property image |
| status | VARCHAR(50) | available, sold, rented |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update date |

## Troubleshooting

**Port already in use:**
- Change PORT in `.env` file

**Cannot connect to Supabase:**
- Check SUPABASE_URL and SUPABASE_KEY in `.env`
- Make sure your Supabase project is active

**Image upload fails:**
- Check storage bucket permissions in Supabase
- Verify JWT token is valid

**CORS errors:**
- Make sure CORS middleware is enabled (it is by default)

## Next Steps

1. Set up proper user authentication system
2. Add email notifications for inquiries
3. Implement payment gateway for properties
4. Add analytics dashboard
5. Set up CI/CD pipeline for deployment

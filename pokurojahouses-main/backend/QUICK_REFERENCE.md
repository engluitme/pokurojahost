# 🚀 Quick Reference Card

## Your Credentials (Save This!)

```
Supabase Project URL: 
Anon Key: 
Service Key: 
Admin Email: 
Admin Password: 
```

## Commands to Remember

### Start the Backend
```bash
cd backend
npm start
```

### View Admin Panel
```
http://localhost:5000/admin/login.html
```

### View Your Website with Backend
```
http://localhost:5000/admin/Dashboard.html
(or your main website: http://172.22.2.210:8000/)
```

## Setup Steps in Order

1. **Create Supabase Account**
   - Go to https://supabase.com
   - Sign up and create project
   - Save your URL and Keys

2. **Setup Environment**
   ```bash
   cd backend
   setup-env.bat  (Windows)
   # OR manually create .env file
   ```

3. **Create Database Tables**
   - Go to Supabase SQL Editor
   - Copy SQL from SUPABASE_SETUP.md Step 2
   - Run it

4. **Start Backend**
   ```bash
   npm install
   npm start
   ```

5. **Test Admin Panel**
   - Open http://localhost:5000/admin/login.html
   - Login with your admin credentials
   - Add a property!

6. **Update Frontend**
   - Add API scripts to your HTML files
   - See SUPABASE_INTEGRATION.md for examples

## File Locations

```
Admin Panel:
  - Login: backend/admin/login.html
  - Dashboard: backend/admin/Dashboard.html
  - Properties: backend/admin/properties.html
  - Add/Edit: backend/admin/addproperty.html

Backend:
  - Server: backend/server.js
  - Routes: backend/routes/
  - Config: backend/.env

Guides:
  - Setup: ./SUPABASE_SETUP.md
  - Integration: ./SUPABASE_INTEGRATION.md
  - API: backend/README.md
```

## Important URLs

| URL | Purpose |
|-----|---------|
| http://localhost:5000 | Backend API |
| http://localhost:5000/admin/login.html | Admin Login |
| http://localhost:5000/admin/Dashboard.html | Admin Dashboard |
| http://localhost:5000/api/properties | Get all properties |
| http://172.22.2.210:8000 | Your website on local network |

## Common Errors & Solutions

| Error | Solution |
|-------|----------|
| "Cannot connect to Supabase" | Check SUPABASE_URL and KEY in .env |
| "Backend not running" | Run `npm start` in backend folder |
| "Properties not showing" | Check SQL was run in Supabase |
| "Image upload fails" | Check storage bucket exists |
| "CORS error" | Make sure backend server is running |

## Next Immediate Actions

- [ ] Create Supabase account
- [ ] Create project and save credentials
- [ ] Run setup-env.bat script
- [ ] Create database tables (SQL)
- [ ] Start backend (npm start)
- [ ] Test admin panel login
- [ ] Add a property
- [ ] Update frontend HTML files
- [ ] Test website shows properties

## Getting Started in 5 Minutes

1. Create Supabase project (1 min)
2. Run setup-env.bat (30 seconds)
3. Run SQL in Supabase (1 min)
4. npm start (30 seconds)
5. Test at http://localhost:5000/admin/login.html (1 min)

Total: ~4 minutes ⚡

## Support

- Read [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- Read [SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md)
- Check [backend/README.md](./backend/README.md)
- Check browser console (F12) for errors

---

**Questions?** Check the relevant guide above!

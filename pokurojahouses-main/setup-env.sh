#!/bin/bash
# Quick Supabase Setup Script

echo "================================"
echo "PokuRoja Houses - Supabase Setup"
echo "================================"
echo ""
echo "Before running this script, please:"
echo "1. Create a Supabase project at https://supabase.com"
echo "2. Get your Project URL and API Key"
echo ""
echo "Enter your Supabase details:"
echo ""

read -p "Enter your Supabase Project URL (https://xxxxx.supabase.co): " SUPABASE_URL
read -p "Enter your Anon Key: " SUPABASE_KEY
read -p "Enter your Service Role Key: " SUPABASE_SERVICE_KEY
read -p "Enter your admin email: " ADMIN_EMAIL
read -s -p "Enter your admin password: " ADMIN_PASSWORD
echo ""

# Generate JWT Secret
JWT_SECRET=$(openssl rand -base64 32)

# Create .env file
cat > .env << EOF
SUPABASE_URL=$SUPABASE_URL
SUPABASE_KEY=$SUPABASE_KEY
SUPABASE_SERVICE_KEY=$SUPABASE_SERVICE_KEY
JWT_SECRET=$JWT_SECRET
ADMIN_EMAIL=$ADMIN_EMAIL
ADMIN_PASSWORD=$ADMIN_PASSWORD
PORT=5000
NODE_ENV=development
EOF

echo ""
echo "✅ .env file created successfully!"
echo ""
echo "Next steps:"
echo "1. Run the SQL queries from SUPABASE_SETUP.md in your Supabase dashboard"
echo "2. Start your backend: npm start"
echo "3. Open admin panel: http://localhost:5000/admin/login.html"
echo ""

# Sporty Shoes Setup Guide

## What Was Wrong
1. ✅ Old Angular `client/` folder removed
2. ⚠️ Supabase database not initialized with tables

## Setup Steps

### 1. Initialize Supabase Database

**In your Supabase Project:**
1. Open Supabase Console → SQL Editor
2. Create new query
3. Copy entire contents of `sporty-shoes-next/supabase/schema.sql`
4. Run the query

This creates all tables and seeds 8 sample products.

### 2. Verify Database Setup
- Go to Table Editor
- Select `products` table
- Should show 8 shoes (Nike Air Max, Adidas Ultra Boost, etc.)

### 3. Start Development Server
```bash
cd sporty-shoes-next
npm install  # if needed
npm run dev
```

App runs at `http://localhost:3000`

## Features Ready to Test
- ✅ Browse products by category
- ✅ Add items to cart
- ✅ Checkout (requires Supabase Auth setup)
- ✅ Sign in/Sign up

## Auth Setup (Optional)
To enable user authentication:
1. Supabase Console → Authentication → Providers
2. Enable Email authentication
3. Create test account at Sign up page

# Quick Supabase Setup for Banking System

## Step 1: Create Supabase Account
1. Go to https://supabase.com
2. Sign up with GitHub/Google
3. Create a new project
4. Choose a region (closest to you)
5. Set a strong database password

## Step 2: Get Connection Details
After project creation, go to Settings > Database:
- Host: `db.your-project-ref.supabase.co`
- Database name: `postgres`
- Username: `postgres`
- Password: (the one you set)
- Port: `5432`

## Step 3: Update Backend Configuration
Edit `backend/.env` file:
```
DATABASE_URL=jdbc:postgresql://db.your-project-ref.supabase.co:5432/postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your-actual-password
```

## Step 4: Create Database Schema
1. Go to Supabase Dashboard > SQL Editor
2. Run the schema from `database/schema.sql`
3. Run procedures from `database/procedures.sql`
4. Run sample data from `database/sample_data.sql`

## Step 5: Start Backend with Production Profile
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

## Alternative: Use Local PostgreSQL
If you prefer local setup:
1. Install PostgreSQL locally
2. Create database: `createdb banking_system`
3. Run schema: `psql -d banking_system -f database/schema.sql`
4. Use default local configuration in application.yml

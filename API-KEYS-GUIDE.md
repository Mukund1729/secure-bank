# 🔐 API Keys & Authentication Guide for Banking System

## What You Need (No API Keys Required!)

### 1. **Database Connection (Supabase)**
Supabase uses **database credentials**, not API keys for PostgreSQL:

```
Database Host: db.your-project-ref.supabase.co
Database Name: postgres
Username: postgres
Password: your-database-password
Port: 5432
```

### 2. **JWT Secret (Already Configured)**
For user authentication tokens:
```
JWT_SECRET=mySecretKey123456789012345678901234567890
```

## 🚀 Quick Setup Steps

### Step 1: Get Supabase Database Credentials
1. Go to https://supabase.com
2. Create account → New Project
3. Set database password (remember this!)
4. Go to Settings → Database
5. Copy connection details (NOT API keys)

### Step 2: Update Backend Configuration
Edit `backend/.env`:
```env
DATABASE_URL=jdbc:postgresql://db.your-project-ref.supabase.co:5432/postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your-actual-database-password
JWT_SECRET=mySecretKey123456789012345678901234567890
```

### Step 3: Create Database Schema
In Supabase Dashboard → SQL Editor, run:
```sql
-- Copy content from database/schema.sql
-- Copy content from database/procedures.sql
-- Copy content from database/sample_data.sql
```

### Step 4: Start Backend
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

## 🔒 Security Notes

- **No API Keys Needed**: Banking system uses direct database connection
- **JWT Secret**: Keep this secret for token security
- **Database Password**: Never commit to Git
- **Environment Variables**: Use .env file for sensitive data

## 🆘 Common Issues

**500 Error on Registration?**
- Database not connected
- Schema not created
- Wrong credentials in .env

**Authentication Failed?**
- Check JWT secret
- Verify user table exists
- Check password hashing

## 📝 Environment File Template

```env
# Database (Required)
DATABASE_URL=jdbc:postgresql://your-host:5432/postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your-password

# Security (Required)
JWT_SECRET=your-long-secret-key

# Optional
PORT=8080
```

No API keys required - just database credentials and JWT secret!

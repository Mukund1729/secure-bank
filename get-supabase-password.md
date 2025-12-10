# 🔐 Get Your Supabase Database Password

## Your Supabase Project: `eovpequkdxfzkdhrtuy`

To complete the setup, you need your **database password** (not the API key):

### Step 1: Get Database Password
1. Go to https://supabase.com/dashboard
2. Select your project: `eovpequkdxfzkdhrtuy`
3. Go to **Settings** → **Database**
4. Look for **Connection string** or **Database password**
5. Copy the password

### Step 2: Update Configuration
Replace `your-database-password` in `backend/.env` with your actual password:
```env
DATABASE_PASSWORD=your-actual-supabase-password
```

### Step 3: Create Database Schema
1. In Supabase Dashboard → **SQL Editor**
2. Run this SQL to create tables:

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    address TEXT,
    role VARCHAR(20) DEFAULT 'CUSTOMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Accounts table
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    account_type VARCHAR(20) NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0.00,
    branch VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(id),
    transaction_type VARCHAR(20) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    balance_after DECIMAL(15,2) NOT NULL,
    description TEXT,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 4: Start Backend
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

Once you provide the database password, the registration will work!

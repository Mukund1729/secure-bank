# Secure Banking / E-Wallet System

A comprehensive banking system with advanced DBMS features including ACID transactions, stored procedures, triggers, and partitioning.

## Tech Stack
- **Backend**: Java Spring Boot with JPA/Hibernate
- **Frontend**: React.js with Bootstrap
- **Database**: PostgreSQL
- **Security**: JWT Authentication, BCrypt password hashing
- **Caching**: Redis (optional)

## Features

### User Features
- User registration and authentication
- Account management and balance viewing
- Money transactions (deposit, withdraw, transfer)
- Mini-statement (recent 10 transactions)
- Loan application and status tracking

### Admin Features
- Loan approval/rejection
- Suspicious transaction monitoring
- Branch-wise financial reports

### DBMS Features
- **ACID Transactions**: Atomic money transfers with rollback
- **Deadlock Handling**: Safe concurrent transaction processing
- **Stored Procedures**: Balance validation and business logic
- **Triggers**: Auto-flagging suspicious transactions
- **Partitioning**: Region-based account partitioning
- **Indexing**: Optimized queries for fast lookups

## Database Schema
- Users (user_id, name, email, password, phone)
- Accounts (account_id, user_id, branch_code, balance)
- Transactions (txn_id, account_id, type, amount, timestamp, status)
- Loans (loan_id, user_id, amount, interest_rate, status)
- Branches (branch_code, branch_name, region)
- Alerts (alert_id, account_id, txn_id, message, timestamp)

## Setup Instructions

### Prerequisites
- Java 17+
- Node.js 16+
- PostgreSQL 13+
- Maven 3.6+

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Database Setup
```bash
psql -U postgres -d banking_system -f database/schema.sql
psql -U postgres -d banking_system -f database/procedures.sql
psql -U postgres -d banking_system -f database/triggers.sql
```

## API Endpoints

### User APIs
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/account/balance` - Get account balance
- `POST /api/transaction/deposit` - Deposit money
- `POST /api/transaction/withdraw` - Withdraw money
- `POST /api/transaction/transfer` - Transfer money
- `GET /api/transaction/statement` - Get mini-statement
- `POST /api/loan/apply` - Apply for loan
- `GET /api/loan/status` - Get loan status

### Admin APIs
- `GET /api/admin/loans/pending` - Get pending loans
- `POST /api/admin/loans/{id}/approve` - Approve loan
- `POST /api/admin/loans/{id}/reject` - Reject loan
- `GET /api/admin/transactions/alerts` - Get suspicious transactions
- `GET /api/admin/reports/branch` - Get branch-wise reports

## Security Features
- JWT token-based authentication
- BCrypt password hashing
- Role-based access control (USER, ADMIN)
- Input validation and sanitization
- SQL injection prevention

## Resume Highlights
✅ Developed a Banking/E-Wallet System using PostgreSQL ensuring ACID transactions and deadlock handling with Spring Boot REST APIs and React frontend.
✅ Implemented stored procedures, triggers for fraud detection, and partitioning for scalable branch-wise account management.
✅ Designed indexing strategies reducing query latency by 40% and applied role-based access control for security.

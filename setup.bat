@echo off
echo Setting up Banking System...

echo.
echo 1. Setting up database...
echo Please ensure PostgreSQL is running and create database 'banking_system'
echo Run the following commands in PostgreSQL:
echo   CREATE DATABASE banking_system;
echo   \c banking_system;
echo.

echo 2. Installing backend dependencies...
cd backend
call mvn clean install
if %errorlevel% neq 0 (
    echo Backend setup failed!
    pause
    exit /b 1
)

echo.
echo 3. Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo Frontend setup failed!
    pause
    exit /b 1
)

echo.
echo Setup completed successfully!
echo.
echo To run the application:
echo 1. Start backend: cd backend && mvn spring-boot:run
echo 2. Start frontend: cd frontend && npm start
echo 3. Setup database: Run SQL scripts in database/ folder
echo.
pause

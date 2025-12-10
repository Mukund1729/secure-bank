@echo off
echo Setting up environment variables for online PostgreSQL database...
echo.
echo Please follow these steps to connect to an online PostgreSQL database:
echo.
echo 1. Sign up for a free PostgreSQL database at one of these providers:
echo    - Supabase (https://supabase.com) - Recommended
echo    - Neon (https://neon.tech)
echo    - ElephantSQL (https://www.elephantsql.com)
echo.
echo 2. After creating your database, you'll get connection details like:
echo    - Host: your-project.supabase.co
echo    - Database: postgres
echo    - Username: postgres
echo    - Password: your-password
echo    - Port: 5432
echo.
echo 3. Set these environment variables in your system:
echo    set DATABASE_URL=jdbc:postgresql://your-host:5432/your-database
echo    set DATABASE_USERNAME=your-username
echo    set DATABASE_PASSWORD=your-password
echo.
echo 4. Or create a .env file in the backend directory with:
echo    DATABASE_URL=jdbc:postgresql://your-host:5432/your-database
echo    DATABASE_USERNAME=your-username
echo    DATABASE_PASSWORD=your-password
echo.
echo 5. Run the backend with production profile:
echo    mvn spring-boot:run -Dspring-boot.run.profiles=prod
echo.
echo Example Supabase connection:
echo DATABASE_URL=jdbc:postgresql://db.your-project.supabase.co:5432/postgres
echo DATABASE_USERNAME=postgres
echo DATABASE_PASSWORD=your-supabase-password
echo.
pause

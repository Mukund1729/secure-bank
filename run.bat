@echo off
echo Starting Banking System...

echo.
echo Starting backend server...
start "Backend Server" cmd /k "cd backend && mvn spring-boot:run"

echo.
echo Waiting for backend to start...
timeout /t 10 /nobreak > nul

echo.
echo Starting frontend server...
start "Frontend Server" cmd /k "cd frontend && npm start"

echo.
echo Banking system is starting up...
echo Backend: http://localhost:8080/api
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul

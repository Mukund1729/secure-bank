@echo off
echo Starting Banking System...

echo.
echo Starting Backend Server...
start "Backend" cmd /k "cd /d \"E:\dbms first\backend\" && mvnw.cmd spring-boot:run"

echo.
echo Waiting for backend to initialize...
timeout /t 15 /nobreak > nul

echo.
echo Starting Frontend Server...
start "Frontend" cmd /k "cd /d \"E:\dbms first\frontend\" && npm start"

echo.
echo Banking System Started!
echo Backend: http://localhost:8080/api
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul

@echo off
echo Starting Banking System Backend with Maven Wrapper...

cd /d "E:\dbms first\backend"

echo Checking Java installation...
java -version
if %ERRORLEVEL% NEQ 0 (
    echo Java not found in PATH. Setting JAVA_HOME...
    set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.12.7-hotspot
    set PATH=%JAVA_HOME%\bin;%PATH%
    echo JAVA_HOME set to: %JAVA_HOME%
)

echo.
echo Starting Spring Boot application...
.\mvnw.cmd spring-boot:run

pause

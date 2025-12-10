@echo off
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.12.7-hotspot
set MAVEN_HOME=E:\dbms first\apache-maven-3.9.11
set PATH=%JAVA_HOME%\bin;%MAVEN_HOME%\bin;%PATH%

echo Starting Banking System Backend...
echo JAVA_HOME: %JAVA_HOME%
echo MAVEN_HOME: %MAVEN_HOME%

cd /d "E:\dbms first\backend"
"%JAVA_HOME%\bin\java" -version
echo.
"%MAVEN_HOME%\bin\mvn.cmd" spring-boot:run

pause

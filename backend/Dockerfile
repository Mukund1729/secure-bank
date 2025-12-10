# ===== Build stage =====
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and download dependencies first (cache)
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Copy source and build
COPY src ./src
RUN mvn -B package -DskipTests

# ===== Run stage =====
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy built jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose app port
EXPOSE 8080

# Use local profile (Supabase)
ENV SPRING_PROFILES_ACTIVE=local

# Start Spring Boot
ENTRYPOINT ["java","-jar","/app/app.jar"]

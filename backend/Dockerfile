# Use an official OpenJDK base image
FROM openjdk:17-jdk-slim as build

# Set the working directory in the container
WORKDIR /app

# Copy the Gradle or Maven wrapper and build.gradle (or pom.xml) files
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY gradlew .

# Copy the source code
COPY src ./src

# Build the application using Gradle
RUN ./gradlew build --no-daemon

# Now, create a new image for running the Spring Boot app
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the .jar file from the build stage
COPY --from=build /app/build/libs/burdemar-1.0.0.jar app.jar

# Expose the application port (8080 by default for Spring Boot)
EXPOSE 8080

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copy everything
COPY . .

# Give execute permission to mvnw
RUN chmod +x mvnw

# Build the project
RUN ./mvnw clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/ai-resume-analyzer-0.0.1-SNAPSHOT.jar"]

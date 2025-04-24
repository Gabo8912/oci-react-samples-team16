FROM openjdk:22

# Set working directory
WORKDIR /app

# Expose the port your Spring Boot app runs on
EXPOSE 8081

# Copy the built jar file
COPY target/MyTodoList-0.0.1-SNAPSHOT.jar MyTodoList.jar

# Copy the Oracle wallet directory into the image
COPY wallet /app/wallet

# Set environment variable for Oracle wallet location (TNS_ADMIN)
ENV TNS_ADMIN=/app/wallet

# Optionally, set JVM options for Oracle JDBC if needed
# ENV JAVA_OPTS="-Doracle.net.tns_admin=/app/wallet"

ENTRYPOINT ["java","-jar","MyTodoList.jar"]
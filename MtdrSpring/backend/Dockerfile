# Usa una imagen base oficial de OpenJDK
FROM openjdk:22

# Define el directorio de trabajo dentro del contenedor
WORKDIR /app

# Expone el puerto en el que corre tu app (Spring Boot por defecto usa 8080)
EXPOSE 8080

# Copia el JAR generado al contenedor
COPY target/MyTodoList-0.0.1-SNAPSHOT.jar app.jar

# Comando de inicio del contenedor
ENTRYPOINT ["java", "-jar", "app.jar"]

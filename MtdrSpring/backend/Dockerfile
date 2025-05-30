# Etapa 1: Build del backend con Maven
FROM maven:3.8.6-amazoncorretto-11 AS build
WORKDIR /build

# Copiar todo el código
COPY . .

# Compilar y empacar el proyecto
RUN mvn clean package spring-boot:repackage

# Etapa 2: Runtime más liviano usando amazoncorretto:11-alpine-jdk
FROM amazoncorretto:11-alpine-jdk
WORKDIR /app

# Copiar el JAR desde la etapa de build
COPY --from=build /build/target/MyTodoList-*.jar app.jar

# (Opcional) Copiar .env solo si lo necesitas para el backend en tiempo de ejecución
# Si NO usas dotenv o alguna lib para leer .env, puedes eliminar esta línea
COPY .env ./

# Exponer el puerto que usa Spring Boot
EXPOSE 8080

# Comando de inicio
ENTRYPOINT ["java", "-jar", "app.jar"]

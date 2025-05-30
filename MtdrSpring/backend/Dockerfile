# Etapa de build (forzamos linux/amd64)
FROM --platform=linux/amd64 maven:3.8.5-openjdk-11 AS maven_build
WORKDIR /build

# Copiamos pom y fuentes
COPY pom.xml .
COPY src ./src

# Build sin usar --mount
RUN mvn clean package spring-boot:repackage -DskipTests

# Etapa de runtime (también on amd64)
FROM --platform=linux/amd64 openjdk:11-jre-slim
WORKDIR /app

# Expone el puerto
EXPOSE 8080

# Copia el JAR generado
COPY --from=maven_build /build/target/MyTodoList-*.jar app.jar

# Arranque
ENTRYPOINT ["java","-jar","app.jar"]

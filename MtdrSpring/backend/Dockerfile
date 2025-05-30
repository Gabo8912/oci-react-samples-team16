# Maven build container
FROM maven:3.8.5-openjdk-11 AS maven_build

# Copia tu pom.xml y código fuente
COPY pom.xml /tmp/
COPY src /tmp/src/

# Directorio de trabajo
WORKDIR /tmp/

# Usa cache de dependencias para no descargarlas siempre
RUN --mount=type=cache,target=/root/.m2 mvn package

# Imagen de ejecución
FROM openjdk:11-jre-slim

# Expone el puerto del backend
EXPOSE 8080

# Copia el JAR desde la etapa de build
COPY --from=maven_build /tmp/target/MyTodoList-*.jar /app/app.jar

# Comando de inicio
CMD ["java", "-jar", "/app/app.jar"]


####
#FROM mx-queretaro-1.ocir.io/ax4igplyyag4/oracle-bot-repository-team16/base-images/maven:3.8.6-amazoncorretto-11 as build

#WORKDIR /build
#COPY . .
#RUN mvn clean package spring-boot:repackage

#FROM mx-queretaro-1.ocir.io/ax4igplyyag4/oracle-bot-repository-team16/base-images/openjdk:11-jre-slim

#WORKDIR /app
#COPY --from=build /build/target/MyTodoList-*.jar app.jar

#EXPOSE 8080

#ENTRYPOINT ["java", "-jar", "app.jar"]

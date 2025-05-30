FROM mx-queretaro-1.ocir.io/ax4igplyyag4/oracle-bot-repository-team16/base-images/maven:3.8.6-amazoncorretto-11 as build
WORKDIR /build
COPY . .
RUN mvn clean package spring-boot:repackage

FROM mx-queretaro-1.ocir.io/ax4igplyyag4/oracle-bot-repository-team16/base-images/openjdk:11-jre-slim
WORKDIR /app
COPY --from=build /build/target/MyTodoList-*.jar app.jar


EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
# ☁️ OCI React Samples

Este repositorio contiene aplicaciones *Full Stack Cloud Native* con frontend en **React JS** y diferentes tipos de backends (Java, Python, .NET, etc.), desplegados sobre **Oracle Cloud Infrastructure (OCI)**.

![image](https://user-images.githubusercontent.com/7783295/116454396-cbfb7a00-a814-11eb-8196-ba2113858e8b.png)

---

## 📦 Proyecto: MyToDo React JS + Java (Spring Boot)

Este proyecto (`mtdrworkshop`) incluye el código, scripts e instrucciones para construir y desplegar una aplicación Cloud Native usando:

- Frontend: React JS  
- Backend: Java con Spring Boot  
- Base de datos: Oracle Autonomous DB

---

## ⚙️ Requisitos (ya preinstalados en OCI Cloud Shell)

Para ejecutar correctamente los scripts del laboratorio necesitas:

- `oci-cli`
- `python` (v2.7 o superior)
- `terraform`
- `kubectl`
- `mvn` (Apache Maven)

---

## 🖥️ Correr la aplicación localmente
######
### 1. 🔧 Configurar `application.properties` del backend

Ubicación:  
`/MtdrSpring/backend/src/main/resources/application.properties`

✅ Activa las líneas marcadas como configuración **local**.  
❗ Asegúrate de que el valor de `spring.datasource.url` apunte a la **ruta local de tu wallet**.

```properties
# LOCAL
spring.datasource.url=jdbc:oracle:thin:@oraclebotdbteam16_high?TNS_ADMIN=D:/ruta/a/tu/wallet

# DEPLOYMENT (comentar si estás trabajando localmente)
# spring.datasource.url=jdbc:oracle:thin:@oraclebotdbteam16_high?TNS_ADMIN=/app/wallet
```
## 2. 🌍 Configurar el archivo .env del frontend
Ubicación:
/frontend/.env (o donde tengas tu frontend)
Este archivo define la URL base con la que React se comunica con el backend.
### ✅ Para correr localmente:
```
const config = {
  backendUrl: "http://localhost:8081"
};
export default config;

```
### 🚀 Para despliegue:
```
const config = {
  backendUrl: "http://160.34.212.189"
};
export default config;

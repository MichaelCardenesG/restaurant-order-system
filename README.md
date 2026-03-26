# 🍽️ Restaurant Order System

Sistema de gestión de pedidos en tiempo real para restaurantes. Los clientes realizan pedidos desde una tableta en su mesa y estos llegan instantáneamente a cocina mediante WebSockets.

## 🛠️ Tecnologías

- **Java 17**
- **Spring Boot**
- **Spring Data JPA / Hibernate**
- **WebSockets (STOMP)**
- **MySQL**
- **Lombok**
- **Maven**

## 🏗️ Arquitectura

El proyecto sigue una arquitectura en capas:

```
Controller → Service → Repository → Entity
```

- **Controller** — expone los endpoints REST
- **Service** — contiene la lógica de negocio
- **Repository** — acceso a base de datos con Spring Data JPA
- **DTO** — objetos de transferencia para no exponer entidades directamente
- **Entity** — modelos de base de datos

## ✨ Funcionalidades

- Crear y listar mesas del restaurante
- Crear y listar productos del menú
- Realizar pedidos desde la mesa con múltiples productos
- Notificación en tiempo real a cocina via WebSockets al recibir un pedido nuevo
- Actualización de estado del pedido (PENDIENTE → EN_PREPARACION → LISTO)
- Notificación en tiempo real al cambiar el estado de un pedido
- Consulta de pedidos pendientes

## 📡 Endpoints principales

### Mesas
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/mesas` | Listar todas las mesas |
| POST | `/mesas` | Crear una mesa |

### Productos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/productos` | Listar todos los productos |
| POST | `/productos` | Crear un producto |

### Pedidos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/pedidos` | Listar todos los pedidos |
| POST | `/pedidos` | Crear un pedido |
| PATCH | `/pedidos/{id}/estado` | Cambiar estado de un pedido |
| GET | `/pedidos/pendientes` | Listar pedidos pendientes |

### WebSocket
| Canal | Descripción |
|-------|-------------|
| `/topic/pedidos` | Recibe pedidos nuevos y actualizaciones de estado |

Los mensajes WebSocket incluyen un campo `tipo` para distinguir entre `NUEVO_PEDIDO` y `ACTUALIZACION_ESTADO`.

## ⚙️ Cómo correrlo localmente

### Requisitos
- Java 17+
- MySQL 8+
- Maven

### Pasos

1. Clona el repositorio
```bash
git clone https://github.com/tu-usuario/restaurant-system.git
cd restaurant-system
```

2. Crea la base de datos en MySQL
```sql
CREATE DATABASE restaurant_system;
```

3. Configura las credenciales en `src/main/resources/application.properties`
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/restaurant_system
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
spring.jpa.hibernate.ddl-auto=update
```

4. Corre el proyecto
```bash
mvn spring-boot:run
```

El servidor estará disponible en `http://localhost:8080`

## 📦 Estructura del proyecto

```
src/main/java/com/restaurant/restaurant_system/
├── config/          # Configuración WebSocket
├── controller/      # Endpoints REST
├── dto/             # Objetos de transferencia
├── entity/          # Modelos de base de datos
├── exception/       # Manejo global de errores
├── repository/      # Acceso a datos
└── service/         # Lógica de negocio
```

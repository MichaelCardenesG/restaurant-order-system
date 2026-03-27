# 🍽️ Restaurant Order Management System

A real-time order management system for restaurants. Customers place orders from a tablet at their table, which are instantly delivered to the kitchen via WebSockets.

## 🛠️ Tech Stack

- **Java 17**
- **Spring Boot**
- **Spring Data JPA / Hibernate**
- **WebSockets (STOMP)**
- **MySQL**
- **Lombok**
- **Maven**

## 🏗️ Architecture

The project follows a clean layered architecture:

```
Controller → Service → Repository → Entity
```

- **Controller** — exposes REST endpoints
- **Service** — contains business logic
- **Repository** — database access via Spring Data JPA
- **DTO** — transfer objects to avoid exposing entities directly
- **Entity** — database models

## ✨ Features

- Create and list restaurant tables
- Create and list menu products
- Place orders from the table with multiple items
- Real-time kitchen notification via WebSockets when a new order is received
- Order status management (PENDING → IN_PREPARATION → DELIVERED)
- Real-time notification to the kitchen on every status change
- Query pending orders

## 📡 Main Endpoints

### Tables
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/mesas` | List all tables |
| POST | `/mesas` | Create a table |

### Products
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/productos` | List all products |
| POST | `/productos` | Create a product |

### Orders
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/pedidos` | List all orders |
| POST | `/pedidos` | Create an order |
| PATCH | `/pedidos/{id}/estado` | Update order status |
| GET | `/pedidos/pendientes` | List pending orders |

### WebSocket
| Channel | Description |
|---------|-------------|
| `/topic/pedidos` | Receives new orders and status updates |

WebSocket messages include a `tipo` field to distinguish between `NUEVO_PEDIDO` and `ACTUALIZACION_ESTADO`.

## ⚙️ Running Locally

### Requirements
- Java 17+
- MySQL 8+
- Maven

### Steps

1. Clone the repository
```bash
git clone https://github.com/MichaelCardenesG/restaurant-order-system.git
cd restaurant-order-system
```

2. Create the database in MySQL
```sql
CREATE DATABASE restaurant_system;
```

3. Configure your credentials in `src/main/resources/application.properties`
```properties
spring.application.name=restaurant-system
spring.datasource.url=jdbc:mysql://localhost:3306/restaurant_system
spring.datasource.username=your_username
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

4. Run the project
```bash
mvn spring-boot:run
```

The server will be available at `http://localhost:8080`

## 📦 Project Structure

```
src/main/java/com/restaurant/restaurant_system/
├── config/          # WebSocket configuration
├── controller/      # REST endpoints
├── dto/             # Data transfer objects
├── entity/          # Database models
├── exception/       # Global error handling
├── repository/      # Data access layer
└── service/         # Business logic
```
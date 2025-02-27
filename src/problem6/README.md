# API Service Module (Backend Architecture) for Score board user

This module is a backend application server providing RESTful APIs for authentication and resource management to
show list of users score and live update score when user do action.
It follows a layered architecture to ensure modularity, scalability, and maintainability.

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Components](#components)
- [Setup](#setup)
- [Usage](#usage)
- [Contributing](#contributing)

## Architecture Overview
The API Service uses a modular, layered architecture:
- **API Layer**: Handles HTTP requests/responses with Express.js.
- **Real-time Communication Protocol**: Use a protocol to maintain connection between server and client like websocket.io .
- **Middleware**: Enforces security (JWT validation) and request preprocessing.
- **Business Logic Layer**: Manages core functionality via controllers and services.
- **Data Access Layer**: Interacts with a relational database using TypeORM.

Key principles:
- RESTful, stateless design.
- Token-based authentication with JWT.
- Scalable and modular structure.

## Components
- **API Layer**: Routes requests to controllers (e.g., `/auth`, `/users`, `/score`).
- **WebSocket Layer**: Manages Socket.IO connections and broadcasts.
- **Middleware**: Validates tokens http and websocket.
- **Controllers**: Orchestrate operations (e.g., sign-out, ).
- **Services**: Encapsulate business logic (e.g., token generation), manage business logic and real-time score updates.
- **Repositories**: Manage database access for entities (`User`, `Token`, `Score`).
- **Database**: Relational DB (e.g., PostgreSQL).

## Real-Time Score Updates
- **Feature**: 
    - Users complete an action, increasing their score with real time.
- **Security**: 
    - Require valid JWT token in http header to authorization.
    - Only admin or user can increase their own score
    - Input validation to prevent malicious users
- **Process**:
  - An API call (e.g., POST /scores) updates the user’s score.
  - The server broadcasts the new score to all clients via Socket.IO.
- **Event Example**:
  ```json
  {
    "event": "scoreUpdate",
    "data": { "userId": 1, "score": 150 }
  }
# API Bookstore Backend Project – Term Project

## 1. Project Overview

This project is a RESTful API server developed as part of **Term Project**.
The goal is to implement a backend system based on a database-driven API design, including authentication, authorization, validation, documentation, and deployment using Docker.

---

## 2. Technology Stack

* **Backend**: Node.js, Express.js
* **Database**: MongoDB
* **Authentication**: JWT
* **Documentation**: Swagger 
* **Testing**: Postman + automated test scripts
* **Deployment**: JCloud, Docker


---

## 3. Execution Methods 

### 3.1 Prerequisites

* Node.js (v18+ recommended)
* npm
* Docker

---

### 3.2 Installation

```bash
https://github.com/ClaraFanget/term-project.git
```
```bash
cd term_project
```
```bash
npm install
```

---

### 3.3 Environment Variables

Create a `.env` file with values sent through the classromm.

```bash
DB_PASSWORD=
JWT_SECRET=
JWT_REFRESH_SECRET=
MONGO_URI=
ADMIN_PASSWORD=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FIREBASE_PROJECT_ID=
```
---

### 3.4 Run Database Seed

```bash
npm run seed
```

This will populate the database with initial test data (users, books, etc.).

---

### 3.5 Start the server using Docker

Requirement: Docker Desktop should be open on your laptop.

```bash
docker-compose up -d --build
```

```bash
docker logs -f bookstore-api
```
The server will start and listen on the following address:

```bash
http://http://localhost:8080
```

---

### 3.6 Run Tests

```bash
npm run test
```

This command runs automated tests for API endpoints.

---

## 4. API Documentation (Swagger)

* **Swagger UI**:

  ```
  113.198.66.75:10089/docs
  ```

Swagger documentation includes:

* Request/response schemas
* Authentication requirements
* Example 
* Error responses 

---


## 5. Postman Collection

A Postman collection is provided in the repository:

```
postman/
 └─ Assignment_2.postman_collection.json
```


---

## 6. Project Structure

```
repo-root
├─ README.md
├─ .env.example
├─ postman/
│  └─ project.postman_collection.json
├─ docs/
│  ├─ API-docs.pdf
│  ├─ DB-docs.pdf
│  └─ ERD.pdf
├─ src/
│  ├─ controllers/
│  ├─ routes/
│  ├─ services/
│  ├─ middlewares/
│  └─ app.js
├─ scripts/
│  └─ seed.js
├─ Dockerfile
├─ docker-compose.yml
└─ tests/
```

---


## 7. Author

* **Student Name**: *Clara Fanget*
* **Course**: Backend API Development
* **Assignment**: Term Project

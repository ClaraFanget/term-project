# API Bookstore Backend Project – Assignment 2

## 1. Project Overview

This project is a RESTful API server developed as part of **Assignment 2**.
The goal is to implement a backend system based on a database-driven API design, including authentication, authorization, validation, documentation, and deployment.

---

## 2. Technology Stack

* **Backend**: Node.js, Express.js
* **Database**: MongoDB
* **Authentication**: JWT
* **Documentation**: Swagger 
* **Testing**: Postman + automated test scripts
* **Deployment**: JCloud


---

## 3. Execution Methods 

### 3.1 Prerequisites

* Node.js (v18+ recommended)
* npm

---

### 3.2 Installation

```bash
https://github.com/ClaraFanget/assignment_2.git
```
```bash
cd assignment_2
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
```
---

### 3.4 Run Database Seed

```bash
npm run seed
```

This will populate the database with initial test data (users, books, etc.).

---

### 3.5 Start the Server

```bash
npm run start
```

The server will start and listen on the configured port.

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
  113.198.66.75:13075/docs
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
└─ tests/
```

---


## 7. Author

* **Student Name**: *Clara Fanget*
* **Course**: Backend API Development
* **Assignment**: Assignment 2

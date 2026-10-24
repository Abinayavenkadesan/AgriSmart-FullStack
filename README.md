# AgriSmart – Smart Agriculture Management System

A resume-ready starter project for agricultural engineering + Java full-stack roles.

## Features
- Responsive React dashboard
- Crop records: add, search, filter, delete
- Irrigation log form and irrigation history
- Sensor readings demo panel (clearly labeled simulated data)
- Spring Boot REST API for crop CRUD
- MySQL schema and sample data
- CORS configuration for a separately hosted frontend

> Important: This is a starter project. Run and test it locally, configure your own database, and only list features as completed on your resume after verifying them. Sensor values are simulated; this is not connected to real hardware.

## Tech stack
- Frontend: React + Vite + CSS
- Backend: Java 17+, Spring Boot, Spring Data JPA
- Database: MySQL 8

## Run frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend opens at `http://localhost:5173`. Without a running backend, the UI uses demo data and displays a demo mode notice.

To connect a deployed backend, create `frontend/.env`:
```env
VITE_API_BASE_URL=https://YOUR-BACKEND-URL/api
```
Restart the frontend after changing environment variables.

## Run backend
1. Create a MySQL database and run `database/schema.sql`.
2. In `backend/src/main/resources/application.properties`, set your database username/password or use environment variables.
3. Run:
```bash
cd backend
mvn spring-boot:run
```
API base URL: `http://localhost:8080/api/crops`

Environment variables supported:
- `DB_URL` (default: `jdbc:mysql://localhost:3306/agris mart?createDatabaseIfNotExist=true` — replace with `jdbc:mysql://localhost:3306/agrismart?createDatabaseIfNotExist=true`)
- `DB_USERNAME`
- `DB_PASSWORD`
- `FRONTEND_ORIGIN` (default `http://localhost:5173`)

## Deploy frontend to Vercel
1. Push this folder to your GitHub repository.
2. In Vercel, import the repository and set **Root Directory** to `frontend`.
3. Build command: `npm run build`; output directory: `dist`.
4. Add `VITE_API_BASE_URL=https://YOUR-BACKEND-URL/api` as an environment variable once the backend is deployed.
5. Redeploy after adding the environment variable.

## Deploy backend to Render
1. Push repository to GitHub.
2. Create a Render Web Service from the repository; set root directory to `backend`.
3. Build command: `mvn clean package -DskipTests`
4. Start command: `java -jar target/agrismart-0.0.1-SNAPSHOT.jar`
5. Add `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, and `FRONTEND_ORIGIN` environment variables.
6. Use a managed MySQL provider and set `DB_URL` to its JDBC URL. Do not commit passwords.

## Resume wording (after testing)
**AgriSmart – Smart Agriculture Management System** | React, Java, Spring Boot, MySQL
- Built a responsive agriculture dashboard to manage crop records and track irrigation activities.
- Developed REST APIs using Spring Boot and Spring Data JPA for crop CRUD operations backed by MySQL.
- Added crop search/filtering, input validation, and a sensor-monitoring demo panel.

Do not claim live deployment until the Vercel and backend deployment URLs work.

# Student Management System

A full-stack Student Management System built with **HTML, CSS, JavaScript** (frontend),
**Node.js + Express.js** (backend), and **MongoDB + Mongoose** (database).

## Features

- User Registration
- User Login (JWT-based authentication)
- Dashboard with student statistics
- Add Student
- View Students
- Edit Student
- Delete Student
- Search Students (by name, roll number, course, or email)
- Logout
- Responsive UI (works on desktop, tablet, and mobile)

## Tech Stack

| Layer      | Technology                     |
|------------|---------------------------------|
| Frontend   | HTML5, CSS3, Vanilla JavaScript |
| Backend    | Node.js, Express.js             |
| Database   | MongoDB, Mongoose               |
| Auth       | JSON Web Tokens (JWT), bcryptjs |

## Folder Structure

```
student-management-system/
│
├── backend/
│   ├── config/
│   │   └── db.js                # MongoDB connection setup
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification middleware
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Student.js           # Student schema
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth/register, /api/auth/login
│   │   └── studentRoutes.js     # /api/students CRUD + search
│   ├── .env.example             # Sample environment variables
│   ├── package.json
│   └── server.js                # Express app entry point
│
├── frontend/
│   ├── css/
│   │   └── style.css            # All styling (responsive)
│   ├── js/
│   │   ├── api.js               # Shared fetch/auth helper functions
│   │   ├── login.js             # Login page logic
│   │   ├── register.js          # Register page logic
│   │   └── dashboard.js         # Dashboard CRUD + search logic
│   ├── index.html               # Login page (default entry point)
│   ├── register.html            # Registration page
│   └── dashboard.html           # Main dashboard (protected)
│
├── .gitignore
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) installed locally, **or** a free
  [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster
- [Postman](https://www.postman.com/downloads/) (optional, for testing the API)

## 1. Install Dependencies

Navigate into the `backend` folder and install the required packages:

```bash
cd student-management-system/backend
npm install
```

This installs: `express`, `mongoose`, `bcryptjs`, `jsonwebtoken`, `cors`, `dotenv`, and `nodemon` (dev dependency).

## 2. Create the `.env` File

Inside the `backend` folder, copy the example file and fill in your own values:

```bash
cp .env.example .env
```

Then edit `backend/.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/student_management
JWT_SECRET=replace_this_with_a_long_random_secret_key
JWT_EXPIRES_IN=1d
```

- If using **MongoDB Atlas**, replace `MONGO_URI` with your connection string, e.g.:
  `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/student_management`
- `JWT_SECRET` can be any long random string (used to sign login tokens).

## 3. Connect MongoDB

**Option A: Local MongoDB**
1. Install MongoDB Community Edition.
2. Start the MongoDB service:
   - Windows: MongoDB usually runs as a service automatically, or run `mongod`
   - macOS/Linux: `mongod --dbpath /path/to/your/db`
3. Keep `MONGO_URI=mongodb://127.0.0.1:27017/student_management` in `.env`.

**Option B: MongoDB Atlas (cloud, no local install needed)**
1. Create a free cluster at https://www.mongodb.com/cloud/atlas/register
2. Create a database user (username + password).
3. Under "Network Access", allow your IP address (or `0.0.0.0/0` for testing).
4. Click "Connect" → "Drivers" and copy the connection string into `MONGO_URI` in `.env`.

## 4. Run the Backend Server

From the `backend` folder:

```bash
npm run dev
```

(Uses `nodemon` for auto-restart on changes.) Or for a plain start:

```bash
npm start
```

You should see:
```
MongoDB Connected: <host>
Server running on http://localhost:5000
```

## 5. Run the Frontend

The Express server already serves the `frontend` folder as static files, so **no separate
frontend server is needed**. Once the backend is running, simply open:

```
http://localhost:5000
```

in your browser. This loads `index.html` (the login page).

> Alternatively, you can open `frontend/index.html` directly with the VS Code "Live Server"
> extension, but then update `API_BASE_URL` in `frontend/js/api.js` to
> `http://localhost:5000/api` since it would no longer be on the same origin.

## 6. Using the App

1. Go to `http://localhost:5000/register.html` and create an account.
2. You'll be logged in automatically and redirected to the dashboard.
3. Use **+ Add Student** to create records, **Edit/Delete** on each row to manage them,
   and the search bar to filter by name, roll number, course, or email.
4. Click **Logout** to end your session.

## 7. Testing the API with Postman

Base URL: `http://localhost:5000/api`

### Register
- **POST** `/auth/register`
- Body (JSON):
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- Response includes a `token` — copy it for the next steps.

### Login
- **POST** `/auth/login`
- Body (JSON):
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Add Student (protected)
- **POST** `/students`
- Headers: `Authorization: Bearer <your_token>`
- Body (JSON):
```json
{
  "name": "Alice Smith",
  "rollNumber": "R001",
  "email": "alice@example.com",
  "phone": "9876543210",
  "course": "Computer Science",
  "year": 2,
  "address": "123 Main St"
}
```

### Get All Students (protected)
- **GET** `/students`
- Headers: `Authorization: Bearer <your_token>`

### Search Students (protected)
- **GET** `/students?keyword=alice`
- Headers: `Authorization: Bearer <your_token>`

### Get Single Student (protected)
- **GET** `/students/:id`
- Headers: `Authorization: Bearer <your_token>`

### Update Student (protected)
- **PUT** `/students/:id`
- Headers: `Authorization: Bearer <your_token>`
- Body: any subset of student fields to update

### Delete Student (protected)
- **DELETE** `/students/:id`
- Headers: `Authorization: Bearer <your_token>`

> For all protected routes, set the header key to `Authorization` and value to
> `Bearer <token>` (replace `<token>` with the JWT you received from register/login).

## 8. Git Setup

Initialize the repository (run from the project root, `student-management-system/`):

```bash
git init
git add .
git commit -m "Initial commit: Student Management System"
```

Push to GitHub:

```bash
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

> Make sure `backend/.env` is **not** committed — it's already listed in `.gitignore`.
> Only `.env.example` should be pushed to GitHub.

## Notes

- Passwords are hashed using `bcryptjs` before being stored — plain text passwords are never saved.
- Authentication uses JWT stored in the browser's `localStorage` and sent via the
  `Authorization: Bearer <token>` header on protected requests.
- Basic input validation and error handling are implemented on both frontend and backend.
- This project is intentionally kept simple and dependency-light, suitable for an internship
  evaluation submission.

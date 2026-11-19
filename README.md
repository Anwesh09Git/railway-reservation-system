# 🚂 RailYatri — Railway Reservation System

A complete, production-style **MERN** (MongoDB, Express, React, Node) railway reservation
application built for a college innovation project. It includes a polished customer-facing
booking experience, JWT authentication, live seat availability, PNR-based ticket lookup,
e-tickets and an admin dashboard for managing trains and reservations.

---

## ✨ Features

### For travellers
- 🔍 **Train search** by source, destination, date and travel class
- 💺 **Live seat availability** and fare display for every class
- 🎫 **Ticket booking** for up to 6 passengers with automatic berth allotment
- 📄 **Digital e-ticket (ERS)** with a unique 10-digit PNR, printable / save as PDF
- 🔎 **PNR status lookup** without logging in
- 📋 **My bookings** with filters, ticket download and one-click cancellation
- 👤 **Profile management** with optional password change
- 📱 Fully responsive design with a modern, professional UI

### For administrators
- 📊 Dashboard with booking, revenue, user and train statistics
- 🚆 Create, edit and delete trains (routes, timings, classes, fares, seats)
- 🧾 View all reservations across users with status breakdown
- 🔐 Role-protected admin routes

### Under the hood
- JWT-based authentication with bcrypt password hashing
- Role-based access control (`user` / `admin`)
- Duplicate-booking-safe seat allocation with automatic waitlist handling
- Cancelled tickets automatically release their seats
- Snapshotted train details on tickets (history stays intact if a train is edited)
- Consistent JSON API responses and centralized error handling

---

## 🛠 Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, React Router 7, Tailwind CSS 3, Axios, lucide-react, react-hot-toast |
| Build tool | Vite 6 |
| Backend | Node.js, Express 4 |
| Database | MongoDB with Mongoose 8 |
| Auth | JWT + bcryptjs |

---

## 🚀 Getting started

### Prerequisites
- **Node.js 18+** (Node 22 recommended)
- **MongoDB** running locally on port 27017, or a MongoDB Atlas connection string — **optional**, see the zero-setup demo below

### ⚡ Zero-setup demo (no MongoDB install needed)
If no MongoDB is reachable, the API automatically starts an **in-memory MongoDB** and seeds it
with 8 trains, demo users and sample tickets on first launch. So after installing dependencies you
can simply run `npm run dev` and use the credentials below. Data resets each time the server
restarts. To use a persistent database, run MongoDB locally/Atlas and run `npm run seed` once.
Set `USE_MEMORY_DB=false` in `server/.env` to disable the fallback.

### 1. Install dependencies

```bash
cd railway-reservation-system
npm run install:all
```

This installs root tooling plus both `server/` and `client/` dependencies.

### 2. Configure the environment

`server/.env` is included with development defaults. For production, edit it:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/railway_reservation
JWT_SECRET=use_a_long_random_secret_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### 3. Seed sample data (for a persistent MongoDB)

```bash
npm run seed
```

Skip this if you are using the automatic in-memory demo database. Otherwise this creates:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@railway.com` | `admin123` |
| Traveller | `demo@railway.com` | `demo123` |

It also inserts 8 trains and 3 sample bookings. Sample PNR: **4829103756**.

> ⚠️ The seed script clears existing users, trains and bookings before inserting demo data.

### 4. Run the app

```bash
npm run dev
```

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:5000>
- API health check: <http://localhost:5000/api/health>

For a production build:

```bash
npm run build     # builds client/dist
npm start         # serves the API
```

---

## 📁 Project structure

```
railway-reservation-system/
├── package.json              # root scripts (dev, seed, build)
├── README.md
├── server/
│   ├── server.js             # Express app entry point
│   ├── seed.js               # Demo data generator
│   ├── .env / .env.example
│   ├── config/db.js
│   ├── middleware/
│   │   ├── auth.js           # protect, adminOnly, generateToken
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Train.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── trainRoutes.js
│   │   └── bookingRoutes.js
│   └── utils/
│       ├── availability.js
│       └── generatePNR.js
└── client/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── api/axios.js
        ├── context/AuthContext.jsx
        ├── components/         # Navbar, Footer, Layout, SearchForm, TrainCard, Ticket, ...
        ├── pages/              # Home, Search, Book, Bookings, Ticket, PNR, Auth, Profile, Admin
        └── utils/format.js
```

---

## 🔌 API reference

All responses follow `{ success: boolean, message?, ...data }`.

### Authentication — `/api/auth`
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/register` | – | Create an account |
| POST | `/login` | – | Log in and receive a JWT |
| GET | `/me` | Bearer | Get current user |
| PUT | `/profile` | Bearer | Update name / phone / password |
| GET | `/admin-check` | Admin | Verify admin role |

### Trains — `/api/trains`
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/` | – | List active trains |
| GET | `/stations` | – | List available stations |
| GET | `/search?from=&to=&date=&class=` | – | Search with availability |
| GET | `/:id?date=` | – | Train details with availability |
| POST | `/` | Admin | Add a train |
| PUT | `/:id` | Admin | Update a train |
| DELETE | `/:id` | Admin | Delete a train |

### Bookings — `/api/bookings`
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/` | Bearer | Create a booking |
| GET | `/my` | Bearer | Current user's bookings |
| GET | `/pnr/:pnr` | – | Look up a ticket by PNR |
| GET | `/:id` | Bearer | Booking details |
| PUT | `/:id/cancel` | Bearer | Cancel a booking |
| GET | `/stats` | Admin | Dashboard statistics |
| GET | `/all` | Admin | All bookings |

---

## 🧠 How seat allocation works

Each train class defines `totalSeats`. When a booking is created for a train + date + class,
the API loads all **confirmed** bookings for that combination, marks their occupied seat numbers
and assigns the first free berths to the new passengers. Berth types cycle through
`Lower → Middle → Upper → Side Lower → Side Upper`. If more passengers are requested than free
seats, the booking is placed on **waitlist** and seats are allotted later as cancellations free
them up. Cancelling a ticket releases its seats immediately because availability is computed
dynamically rather than stored.

---

## 🎓 Notes for submission

- This is an educational demo; the payment step is simulated (no gateway integration).
- Replace the development `JWT_SECRET` before deploying anywhere public.
- For MongoDB Atlas, set `MONGO_URI` to your Atlas connection string and allow your IP.
- Good extensions: payment gateway, SMS/email notifications, QR code on e-tickets,
  train status API integration and automated waitlist promotion.

---

Made with ❤️ using the MERN stack.

# 🏆 CODEBID — Real-Time Code Bidding Platform

<div align="center">

![MERN Stack](https://img.shields.io/badge/Stack-MERN-20232A?style=for-the-badge&logo=react)
![Socket.io](https://img.shields.io/badge/Socket.io-Real--Time-010101?style=for-the-badge&logo=socket.io)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js)

**A live, interactive bidding platform where teams compete by wagering virtual coins to answer coding challenges.**

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Architecture](#-architecture) · [Team](#-team)

</div>

---

## 📌 Overview

CODEBID transforms conventional coding competitions into high-stakes, real-time bidding events. Teams strategically wager virtual coins on their confidence in solving coding problems — making every question a tactical decision, not just a technical one. Built for hackathons, coding events, and classroom competitions.

---

## ✨ Features

### For Teams (Participants)
- **Secure Registration & Login** — Sign up with team name, representative, email, and password
- **Virtual Coin Wallet** — Each team starts with **2,000 coins**; balances shift with every round
- **Private Bidding** — Bids are confidential; only the admin can view all submissions
- **Live Leaderboard** — Real-time rankings update instantly after every round
- **20-Second Bid Timer** — Teams must place bids within the time limit or forfeit their turn (bid recorded as zero)

### For Admins
- **Predefined Admin Logins** — Email-based access, no password required
- **Full Round Control** — Start/end rounds, set question title and category, mark answers as correct or wrong
- **Bid Visibility** — Admins see all team bids in real time while teams bid privately
- **Coin Reset** — Reset all team wallets to the default balance at any time

### Scoring System

| Difficulty | Correct Answer | Wrong Answer |
|------------|:--------------:|:------------:|
| Easy       | +100 coins     | −150 coins   |
| Medium     | +200 coins     | −250 coins   |
| Hard       | +400 coins     | −350 coins   |

### Winner Selection
- **Highest bid wins** the round
- **Tiebreaker:** Earliest submission timestamp

---

## 🛠️ Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React, React Router, Axios, Socket.io-client    |
| Backend    | Node.js, Express, Socket.io                     |
| Database   | MongoDB, Mongoose                               |
| Auth       | JSON Web Token (JWT), bcryptjs                  |
| Deployment | Render (backend) · Vercel (frontend)            |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas)
- [Git](https://git-scm.com/)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/raghunadhchowdary1-del/CodeBid_Event-2k26.git
cd CodeBid_Event-2k26
```

**2. Install backend dependencies**

```bash
cd server
npm install
```

**3. Configure environment variables**

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

**4. Install frontend dependencies**

```bash
cd ../client
npm install
```

**5. Configure the frontend API URL**

Create a `.env` file inside the `client/` directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

**6. Run the application**

Open two terminals:

```bash
# Terminal 1 — Start the backend
cd server
npm run dev
```

```bash
# Terminal 2 — Start the frontend
cd client
npm start
```

The app will be available at `http://localhost:3000`.

---

## 🏗️ Architecture

```
CodeBid_Event-2k26/
├── client/                  # React frontend
│   ├── public/
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # Route-level page components
│       ├── context/         # Global state management
│       └── socket.js        # Socket.io client configuration
│
└── server/                  # Node.js + Express backend
    ├── models/              # Mongoose schemas (Team, Round, Bid)
    ├── routes/              # REST API routes
    ├── middleware/          # Auth & error handling middleware
    └── socket/              # Socket.io event handlers
```

---

## 🔌 Real-Time Events (Socket.io)

| Event              | Direction         | Description                            |
|--------------------|-------------------|----------------------------------------|
| `round:start`      | Server → Clients  | New round begins; timer starts         |
| `round:end`        | Server → Clients  | Round closes; bids are locked          |
| `bid:submit`       | Client → Server   | Team submits a bid                     |
| `leaderboard:update` | Server → Clients | Updated standings broadcast to all    |
| `winner:announce`  | Server → Clients  | Round winner and result revealed       |

---

## 🚢 Deployment

### Backend (Render)

1. Push the `server/` directory to a GitHub repository
2. Create a new **Web Service** on [Render](https://render.com)
3. Set the environment variables (`MONGO_URI`, `JWT_SECRET`, `PORT`)
4. Set the build command to `npm install` and start command to `npm start`

### Frontend (Vercel)

1. Push the `client/` directory to a GitHub repository
2. Import the project on [Vercel](https://vercel.com)
3. Set `REACT_APP_API_URL` to your Render backend URL
4. Deploy — Vercel handles the build automatically

---

## 👥 Team

**VRSEC — Batch 2026**

| Role        | Name            | Email                                                              |
|-------------|-----------------|--------------------------------------------------------------------|
| 🧑‍💻 Lead    | N Raghu Nadh    | [238w1a12a8@vrsec.ac.in](mailto:238w1a12a8@vrsec.ac.in)           |
| Member      | Ch. Akshay      | [238w1a1283@vrsec.ac.in](mailto:238w1a1283@vrsec.ac.in)           |
| Member      | N Manikanta     | [238w1a12a7@vrsec.ac.in](mailto:238w1a12a7@vrsec.ac.in)           |
| Member      | M Vijay Babu    | [238w1a12a2@vrsec.ac.in](mailto:238w1a12a2@vrsec.ac.in)           |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  Made with ❤️ by Team CODEBID · VRSEC 2026
</div>

<div align="center">

# 🏆 CODEBID

### Real-Time Competitive Code Bidding Platform

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-20232A?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Socket.io](https://img.shields.io/badge/Real--Time-Socket.io-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)
[![Node](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**CODEBID turns coding competitions into high-stakes bidding battles.**  
Teams wager virtual coins on their ability to solve coding challenges — every round is a mix of skill, strategy, and nerve.

[📖 Overview](#-overview) · [✨ Features](#-features) · [🛠️ Tech Stack](#%EF%B8%8F-tech-stack) · [🚀 Getting Started](#-getting-started) · [🏗️ Architecture](#%EF%B8%8F-architecture) · [🔌 Socket Events](#-real-time-events) · [🚢 Deployment](#-deployment) · [👥 Team](#-team)

</div>

---

## 📖 Overview

CODEBID is a live, interactive bidding platform built for hackathons, college coding events, and classroom competitions. Teams are given coding questions and must **strategically wager virtual coins** based on their confidence — the highest bidder who answers correctly wins the round.

It's not just about who can code. It's about **who dares to bet on themselves.**

---

## ✨ Features

### 👥 For Participants (Teams)

- 🔐 **Secure Registration & Login** — Sign up with team name, representative, email, and password
- 💰 **Virtual Coin Wallet** — Every team starts with **2,000 coins**; balances change after each round
- 🔒 **Private Bidding** — Bids are hidden from other teams; only admins can see all submissions
- 📊 **Live Leaderboard** — Rankings update in real time after every round
- ⏱️ **20-Second Bid Timer** — Place your bid in time or it's recorded as zero

### 🛡️ For Admins

- ✅ **Predefined Admin Access** — Email-based login, no password required
- 🎛️ **Full Round Control** — Start/end rounds, set question title & category, mark answers correct or wrong
- 👁️ **Real-Time Bid Visibility** — View all team bids live while participants bid privately
- 🔄 **Coin Reset** — Reset all team wallets to the default balance at any time

### 🏅 Scoring System

| Difficulty | ✅ Correct Answer | ❌ Wrong Answer |
|:----------:|:-----------------:|:---------------:|
| Easy       | +100 coins        | −150 coins      |
| Medium     | +200 coins        | −250 coins      |
| Hard       | +400 coins        | −350 coins      |

> **Round Winner:** Highest bid among correct answers. Tiebreaker: earliest submission timestamp.

---

## 🛠️ Tech Stack

| Layer      | Technology                                         |
|------------|----------------------------------------------------|
| Frontend   | React, React Router, Axios, Socket.io-client       |
| Backend    | Node.js, Express, Socket.io                        |
| Database   | MongoDB, Mongoose                                  |
| Auth       | JSON Web Tokens (JWT), bcryptjs                    |
| Deployment | Render (backend) · Vercel (frontend)               |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Git](https://git-scm.com/)

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/raghunadhchowdary1-del/CodeBid_Event-2k26.git
cd CodeBid_Event-2k26
```

#### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

#### 3. Set up the frontend

```bash
cd ../client
npm install
```

Create a `.env` file in the `client/` directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

#### 4. Run the application

Open two terminals:

```bash
# Terminal 1 — Backend
cd server
npm run dev
```

```bash
# Terminal 2 — Frontend
cd client
npm start
```

The app will be running at **http://localhost:3000** 🎉

---

## 🏗️ Architecture

```
CodeBid_Event-2k26/
├── client/                    # React frontend
│   ├── public/
│   └── src/
│       ├── components/        # Reusable UI components
│       ├── pages/             # Route-level page components
│       ├── context/           # Global state (React Context)
│       └── socket.js          # Socket.io client setup
│
└── server/                    # Node.js + Express backend
    ├── models/                # Mongoose schemas (Team, Round, Bid)
    ├── routes/                # REST API endpoints
    ├── middleware/            # Auth & error handling
    └── socket/                # Socket.io event handlers
```

---

## 🔌 Real-Time Events

| Event                | Direction          | Description                                   |
|----------------------|--------------------|-----------------------------------------------|
| `round:start`        | Server → Clients   | New round begins; countdown timer starts      |
| `round:end`          | Server → Clients   | Round closes; bids are locked                 |
| `bid:submit`         | Client → Server    | Team submits a bid                            |
| `leaderboard:update` | Server → Clients   | Updated standings broadcast to all teams      |
| `winner:announce`    | Server → Clients   | Round winner and result revealed              |

---

## 🚢 Deployment

### Backend → [Render](https://render.com)

1. Push the `server/` directory to GitHub
2. Create a new **Web Service** on Render
3. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `PORT`
4. Set build command: `npm install` | Start command: `npm start`

### Frontend → [Vercel](https://vercel.com)

1. Push the `client/` directory to GitHub
2. Import the project on Vercel
3. Set environment variable: `REACT_APP_API_URL=<your-render-backend-url>`
4. Deploy — Vercel handles the rest automatically

---

## 👥 Team

**VRSEC — Batch 2026**

| Role          | Name           | Email                                                        |
|---------------|----------------|--------------------------------------------------------------|
| 🧑‍💻 Team Lead | N Raghu Nadh   | [238w1a12a8@vrsec.ac.in](mailto:238w1a12a8@vrsec.ac.in)     |
| 👨‍💻 Member    | Ch. Akshay     | [238w1a1283@vrsec.ac.in](mailto:238w1a1283@vrsec.ac.in)     |
| 👨‍💻 Member    | N Manikanta    | [238w1a12a7@vrsec.ac.in](mailto:238w1a12a7@vrsec.ac.in)     |
| 👨‍💻 Member    | M Vijay Babu   | [238w1a12a2@vrsec.ac.in](mailto:238w1a12a2@vrsec.ac.in)     |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ by **Team CODEBID** · VRSEC 2026

⭐ Star this repo if you find it interesting!

</div>

# CODEBID – Real-Time Code Bidding Platform

CODEBID is a live, interactive web application where teams compete by bidding virtual coins to answer coding questions. Built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io for real-time updates, it provides a engaging experience for coding events, hackathons, and classroom competitions.

## ✨ Features

- **Team Registration & Login** – Teams sign up with a name, representative, email, and password. Admins have predefined email logins (no password required).
- **Role‑Based Dashboards** – Separate interfaces for participants and administrators.
- **Virtual Coin Wallet** – Each team starts with 2000 coins; coins are updated based on performance.
- **Private Bidding** – Teams place bids privately during active rounds; only the admin sees all bids.
- **Automatic Winner Selection** – Highest bid wins; ties broken by earliest submission.
- **Category‑Based Scoring** – Rewards and penalties depend on question difficulty:
  - Easy: Correct +100, Wrong –150
  - Medium: Correct +200, Wrong –250
  - Hard: Correct +400, Wrong –350
- **Real‑Time Updates** – Live leaderboard, bid notifications, and round state changes via Socket.io.
- **20‑Second Timer** – Teams must bid within the time limit; zero bid recorded if they miss.
- **Admin Controls** – Start/end rounds, enter question title and category, mark answers correct/wrong, reset all coins.
- **Responsive, Dark‑Themed UI** – Designed for a coding‑competition vibe.

## 🛠️ Tech Stack

- **Frontend**: React, React Router, Axios, Socket.io‑client
- **Backend**: Node.js, Express, MongoDB, Mongoose, Socket.io, JSON Web Token, bcryptjs
- **Deployment**: Render (backend), Vercel (frontend)

## 👥 Team

- **Lead**: N Raghu Nadh – [238w1a12a8@vrsec.ac.in](mailto:238w1a12a8@vrsec.ac.in)
- **Members**:
  - Ch. Akshay – [238w1a1283@vrsec.ac.in](mailto:238w1a1283@vrsec.ac.in)
  - N Manikanta – [238w1a12a7@vrsec.ac.in](mailto:238w1a12a7@vrsec.ac.in)
  - M Vijay Babu – [238w1a12a2@vrsec.ac.in](mailto:238w1a12a2@vrsec.ac.in)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or later)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/raghunadhchowdary1-del/CodeBid_Event-2k26.git
   cd CodeBid_Event-2k26

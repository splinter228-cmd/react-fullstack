# DevBlog — Fullstack Social Blog App

A fullstack blog/social platform built with **React** (frontend) and **Node.js/Express** (backend), featuring authentication, posts, likes, comments, user profiles, and content moderation.

## ✨ Features

- 🔐 **Authentication** — JWT-based login/registration with hashed passwords (bcrypt)
- 📝 **Posts** — create, edit, and delete posts
- ❤️ **Likes** — like/unlike posts in real time
- 💬 **Comments** — add and delete comments on posts
- 👤 **Profiles** — user profile pages with avatar, banner, post/like stats
- 🛡️ **Content moderation** — profanity filter blocks inappropriate posts and comments
- ✅ **Form validation** — real-time validation with Formik + Yup
- 🎨 **Modern UI** — dark theme with glassmorphism cards, custom backgrounds, and smooth animations

## 🛠️ Tech Stack

**Frontend:** React, React Router, Formik, Yup, MUI Icons, Axios
**Backend:** Node.js, Express, Sequelize, MySQL, JWT, bcrypt, multer
**Styling:** Custom CSS (CSS variables, glassmorphism, responsive design)

## 📸 Screenshots

*(add screenshots here — Login, Home feed, Post page, Profile, Create Post)*

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MySQL server running locally

### 1. Clone the repository

```bash
git clone https://github.com/splinter228-cmd/react-fullstack.git
cd react-fullstack
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create `server/config/config.json` based on `config.example.json` with your local MySQL credentials.

```bash
npm start
```

Server runs on `http://localhost:3001`.

### 3. Set up the frontend

```bash
cd client
npm install
npm start
```

App runs on `http://localhost:3000`.

## 📁 Project Structure

```
react-fullstack/
├── client/          # React frontend
│   ├── public/      # Static assets (images, favicon)
│   └── src/
│       ├── pages/       # Page components (Login, Home, Post, Profile, etc.)
│       ├── components/  # Reusable components (Notification)
│       └── helpers/     # API instance, Auth context
├── server/          # Express backend
│   ├── routes/       # API routes (Users, Posts, Comments, Likes)
│   ├── models/        # Sequelize models
│   ├── middlewares/   # JWT auth middleware
│   └── utils/          # Profanity filter
```

## 🔑 Environment Variables

**Client** (`.env` in `client/`):

```
REACT_APP_API_URL=http://localhost:3001
```

## 📝 License

This project is available for demonstration and portfolio purposes.

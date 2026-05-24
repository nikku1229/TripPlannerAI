# ✈️ AI Travel Planner

A modern full-stack **AI-powered Travel Planning Application** built with **React + Node.js + MongoDB**, designed to create smart travel itineraries, provide real-time weather insights, interactive maps, analytics dashboards, and AI-based travel assistance.

The platform combines:

* 🤖 AI trip planning
* 🗺️ Interactive travel maps
* 🌤️ Real-time weather data
* 💬 AI travel assistant
* 📊 Travel analytics dashboard
* 🌙 Premium dark/light UI

---

# 🚀 Live Demo

🌐 Frontend Live:
[AI Travel Planner Live App](https://trip-planner-ai-prototype.vercel.app)

---

# 📌 Features

## 🔐 Authentication System

* Secure JWT Authentication
* User Registration & Login
* Protected Routes
* Persistent User Sessions

---

## 🤖 AI-Powered Itinerary Generation

* Smart travel itinerary planning
* AI-generated travel recommendations
* Dynamic destination suggestions
* Google Gemini AI integration

---

## 🗺️ Interactive Maps

* Leaflet-powered maps
* Destination markers
* Location visualization
* Interactive travel exploration

---

## 🌤️ Real-Time Weather

* OpenWeather API integration
* Live weather updates
* Temperature & condition tracking
* Weather-aware trip planning

---

## 💬 AI Chat Assistant

* AI-based travel guidance
* Travel recommendations
* Destination advice
* Conversational planning experience

---

## 📊 Analytics Dashboard

* Travel insights & charts
* Recharts integration
* Visual travel analytics
* Interactive dashboard cards

---

## 🎨 UI/UX Features

* Premium responsive UI
* Dark & Light theme support
* Smooth Framer Motion animations
* Mobile-first design approach
* Clean modern layouts

---

# 🛠️ Tech Stack

## Frontend

* React 18
* Vite
* Tailwind CSS
* React Router DOM
* Framer Motion
* Recharts
* Leaflet
* Axios

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Google Gemini AI API
* OpenWeather API

---

# 📂 Project Structure

```bash
AI-Travel-Planner/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# ⚙️ Prerequisites

Before running the project:

* Node.js v16+
* MongoDB
* npm or yarn
* Google Gemini API Key
* OpenWeather API Key

---

# 📥 Installation & Setup

## Clone Repository

```bash
git clone https://github.com/nikku1229/TripPlannerAI
cd TripPlannerAI
```

---

# 🔧 Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/travel_planner
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
FRONTEND_URL=http://localhost:5173
```

Run backend:

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

# 🎨 Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# 🔌 API Overview

Base URL:

```bash
http://localhost:5000/api
```

---

# 🔐 Authentication Routes

| Method | Endpoint         | Description      |
| ------ | ---------------- | ---------------- |
| POST   | `/auth/register` | Register User    |
| POST   | `/auth/login`    | Login User       |
| GET    | `/auth/me`       | Get Current User |

---

# ✈️ Trip & AI Routes

| Method | Endpoint         | Description           |
| ------ | ---------------- | --------------------- |
| POST   | `/trip/generate` | Generate AI Itinerary |
| GET    | `/trip/history`  | Get Saved Trips       |
| POST   | `/chat`          | AI Travel Chat        |
| GET    | `/weather/:city` | Get Weather Data      |

---

# 🌍 Maps & Weather Integration

## 🗺️ Maps

* Leaflet interactive maps
* Dynamic location markers
* Destination previews

## 🌤️ Weather

* OpenWeather real-time forecasts
* Temperature & condition display
* Travel condition insights

---

# 📊 Dashboard Features

* Trip analytics
* Travel charts
* Budget & destination tracking
* Activity insights
* Visual data representation

---

# 🔐 Security Features

* JWT Authentication
* Password hashing
* Protected API routes
* Environment variable protection
* Secure API integrations

---

# 📈 Performance & UX

* Optimized React rendering
* Responsive layouts
* Smooth page transitions
* Efficient API handling
* Fast Vite development setup

---

# 🚀 Future Improvements

* Flight & hotel booking integration
* Google Maps integration
* Collaborative trip planning
* Expense tracking
* Offline trip saving
* Push notifications
* Multi-language support
* AI budget optimization

---

# 🌐 Deployment

## Frontend

Recommended:

* Vercel
* Netlify

## Backend

Recommended:

* Render
* Railway
* VPS Deployment

## Database

* MongoDB Atlas

---

# 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

# 👨‍💻 Author

## Nitesh Sharma

* GitHub:
  [GitHub Profile](https://github.com/nikku1229)

* LinkedIn:
  [LinkedIn Profile](https://www.linkedin.com/in/nitish-sharma-648a581b2/)

---

# ⭐ Support

If you like this project:

⭐ Star the repository
🔁 Share the project
🤝 Contribute to development

---

# 🔥 Built for Smart & Modern Travel Planning

AI Travel Planner combines artificial intelligence, real-time data, and modern UI design to deliver a smarter and more interactive travel planning experience.

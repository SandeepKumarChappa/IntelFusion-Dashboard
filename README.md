# 🌐 IntelFusion Dashboard

A scalable, full-stack Intelligence command center built to ingest, analyze, and visualize multi-source intelligence data. This production-ready prototype features native Natural Language Processing (NLP) for instant AI taxonomy, interactive dark-mode cartography, and robust geo-spatial fallback logic.

![Dashboard Preview](https://via.placeholder.com/1000x500.png?text=IntelFusion+Dashboard)

## ✨ Core Features

*   **Multi-Source Data Ingestion:** Automatically scales and sorts inputs via CSV, JSON arrays, and Image Multipart forms.
*   **Geospatial Visualization:** Fully interactive map overlay powered by Leaflet and custom CartoDB Dark Matter tiles.
*   **Edge NLP AI Processing:** Instant sentiment analysis and keyword extraction running locally on the Node engine via `sentiment` and `keyword-extractor`, requiring zero external API limits or latencies.
*   **Dynamic Taxonomy:** Granular categorical rendering separates OSINT, HUMINT, and IMINT clusters using real-time SVG icon coloring.
*   **Smart Fallback Integrity:** Implemented fallback mathematics to simulate random ocean coordinates for un-geocoded image submissions to maintain Dashboard UX integrity.
*   **Premium Aesthetic:** Built on Tailwind CSS v4 utilizing strict `#0a0a0a` palettes and `.glass` utility classes for premium glassmorphism overlays.

## 🛠️ Stack Architecture

*   **Frontend**: React, Vite, TailwindCSS v4, React-Leaflet, Axios, Lucide-React.
*   **Backend**: Node.js, Express, Multer, CSV-Parser, Natural Language Processing.
*   **Database**: MongoDB Atlas (Mongoose ODM).

---

## 🚀 Quick Start Guide

### 1. Database Configuration
1. Clone the repository.
2. Navigate to `backend` and create an environment file:
   ```bash
   cp .env.example .env
   ```
3. Insert your MongoDB Atlas connection string into `MONGODB_URI`.

### 2. Booting the API (Backend)
```bash
cd backend
npm install
npm run dev
```

### 3. Booting the Client (Frontend)
Open a new, separate terminal tab:
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173` to access the IntelFusion environment!

## 📌 Usage

*   **Manual Mapping:** Upload `sample_data.json` directly through the ingestion portal to instantly map South Asian and European test data.
*   **Image Analysis:** Submit `.jpg` files without geospatial tags and observe the backend assign autonomous fallback coordinates. Include text in the 'Description' field to view instantly calculated Sentiment polarity (+ / - / Neutral) and context extraction arrays!

---
*Developed by Sandeep Kumar Chappa.*

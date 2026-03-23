# 🚀 NASA Mission Explorer

A visually rich web application that displays stunning space imagery using the **NASA Astronomy Picture of the Day (APOD) API**.
Users can explore recent space images, view them in full-screen, and select a specific date to discover what the universe looked like on that day.

---

## 🌌 Project Overview

NASA Mission Explorer is a gallery-style web app that fetches space images and information from NASA’s APOD service.
It focuses on a modern UI with a dark space-themed design and interactive browsing experience.

API used:
https://api.nasa.gov/planetary/apod?count=10&api_key=FxdKcgCL4qmGFAXeYAyG4DcO4ABGg2EHZhyBnbay

---

## ✨ Features

* **Space Image Gallery** – Displays multiple astronomy images fetched from the API.
* **Date Explorer** – Select any date to view the APOD for that specific day.
* **Full-Screen Modal View** – Click an image to view it in detail.
* **HD Image Toggle** – Switch between standard and HD versions of the image.
* **Image Details** – Title, explanation, and date shown for each entry.
* **Responsive UI** – Works across desktop, tablet, and mobile devices.
* **Modern Space Theme** – Dark interface with glowing UI elements and immersive layout.

---

## 🛠️ Tech Stack

* HTML5
* CSS3
* JavaScript (Vanilla JS / Fetch API)
* NASA APOD API
* Netlify (for deployment)

---

## 📂 Project Structure

```
nasa-mission-explorer
│
├── index.html
├── style.css
├── script.js
├── assets
│   └── images
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/07shlokjoshi/nasa-mission-explorer.git
```

### 2. Navigate to the project folder

```bash
cd nasa-mission-explorer
```

### 3. Run locally

Open the `index.html` file in your browser.

---

## 🔌 API Integration

Example API request used in the project:

```javascript
const API_URL = "https://api.nasa.gov/planetary/apod?count=10&api_key=FxdKcgCL4qmGFAXeYAyG4DcO4ABGg2EHZhyBnbay";

fetch(API_URL)
  .then(response => response.json())
  .then(data => {
      console.log(data);
  });
```

Fetch APOD by date:

```javascript
const date = "2026-03-23";
const url = `https://api.nasa.gov/planetary/apod?date=${date}&api_key=YOUR_API_KEY](https://api.nasa.gov/planetary/apod?count=10&api_key=FxdKcgCL4qmGFAXeYAyG4DcO4ABGg2EHZhyBnbay)`;
```

---

## 🎨 UI Design Concept

* Dark space-themed background
* Glow effects for cards and buttons
* Image grid layout
* Smooth hover animations
* Full-screen modal transitions

---

## 🚀 Deployment

You can deploy this project using **Netlify**.

Steps:

1. Push the project to GitHub.
2. Go to Netlify.
3. Click **Add new site → Import from Git**.
4. Select your repository.
5. Deploy.

---

## 📸 Future Improvements

* Search by keyword or topic
* Infinite scrolling gallery
* Save favorite images
* Image download option
* Animation effects for transitions
* Light/Dark theme toggle

---

## 📜 License

This project is for educational purposes and uses NASA's public API.

NASA API documentation:
https://api.nasa.gov/

---

## 👨‍💻 Author

Developed as part of an API integration project.

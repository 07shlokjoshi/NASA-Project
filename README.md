# 🚀 NASA Mission Explorer

A visually rich gallery-style web app that displays stunning space imagery using the **NASA Astronomy Picture of the Day (APOD) API**.
Users can explore recent space images, view them in full-screen, and select a specific date to discover what the universe looked like on that day.


🌌 Project Overview

NASA Mission Explorer is a gallery-style web app that fetches space images and information from NASA’s APOD service.
It focuses on a modern UI with a dark space-themed design and interactive browsing experience.

## ✨ Features

- **Space Image Gallery**: Fetches a rotating set of APOD entries and renders them as cards.
- **Date Explorer**: Select any date to retrieve the APOD entry for that day.
- **Full-Screen Modal View**: Click a card (or “Open full view”) to see the media in detail.
- **HD Image Toggle**: Prefer HD in the gallery and/or in the modal when available.
- **Image Details**: Title, explanation, date, media type, and credits.
- **Responsive UI**: Works across desktop, tablet, and mobile sizes.

## 🛠️ Tech Stack

- HTML5
- CSS3
- JavaScript (Fetch API)
- NASA APOD API

## 📂 Project Structure

```
nasa-mission-explorer
├── index.html
├── style.css
├── script.js
├── assets
│   └── images
└── README.md
```

## ⚙️ Run Locally

Open `index.html` in your browser:

1. Finder → open `nasa-mission-explorer/index.html`, or
2. Use a local static server (recommended).

## 🔌 API

This project uses NASA’s APOD endpoint:

- Gallery (randomized): `count=10`
- By date: `date=YYYY-MM-DD`

Docs: `https://api.nasa.gov/`

🎨 UI Design Concept
Dark space-themed background
Glow effects for cards and buttons
Image grid layout
Smooth hover animations
Full-screen modal transitions


📸 Future Improvements
Search by keyword or topic
Infinite scrolling gallery
Save favorite images
Image download option
Animation effects for transitions
Light/Dark theme toggle

## 🚀 Deploy (Netlify)

1. Push this folder to GitHub
2. In Netlify: **Add new site → Import from Git**
3. Build settings:
   - **Build command**: (none)
   - **Publish directory**: `nasa-mission-explorer`


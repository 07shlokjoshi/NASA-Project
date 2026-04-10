# 🚀 NASA Mission Explorer

A visually rich gallery-style web app that displays stunning space imagery using the **NASA Astronomy Picture of the Day (APOD) API**.

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
- Vanilla JavaScript (Fetch API)
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

## 🚀 Deploy (Netlify)

1. Push this folder to GitHub
2. In Netlify: **Add new site → Import from Git**
3. Build settings:
   - **Build command**: (none)
   - **Publish directory**: `nasa-mission-explorer`


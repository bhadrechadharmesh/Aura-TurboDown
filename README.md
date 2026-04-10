# Aura TubeDown App 🎥

Welcome to **Aura TubeDown**, a powerful, modern, and high-performance YouTube video downloader application! Built with a clean frontend and a robust backend, our application makes downloading and managing media seamless without restrictions.

## ✨ Key Features

- **Fast & Reliable Downloads**: Simultaneously download high-res video contents.
- **Dynamic Format Parsing**: Choose between different audio/video formats.
- **YouTube Bot Bypass**: Configurable `yt-dlp` integration with browser cookies to bypass "Sign in to confirm you're not a bot" verifications effortlessly.
- **Real-Time Progress Metrics**: Live downloading statuses with percentage tracking and ETA, powered by WebSockets.
- **Seamless Merging**: Automated merging of separate high-quality video and audio tracks via FFmpeg.
- **Playlist Extraction**: Fully capable of scraping individual video links from playlist directories.

## 🛠️ Technology Stack

Aura TubeDown uses a standard Client-Server architecture and relies on modern web technologies:

### Frontend Layer (`/client`)
- **UI Framework**: React 19 powered by Vite for fast HMR.
- **Communication Protocol**: `socket.io-client` for real-time progress events.
- **Icons**: `lucide-react`.

### Backend Layer (`/server`)
- **Runtime**: Node.js
- **REST APIs**: Express.js
- **Streaming & WebSocket**: `socket.io`
- **Core Engine**: `youtube-dl-exec` (Wrapper for yt-dlp) ensuring the best download heuristics.
- **Post Processor**: `ffmpeg-static` for transcoding, merging, and format processing.

---

## 🚀 Getting Started

Follow these step-by-step instructions to get a local development environment up and running.

### Prerequisites

Ensure you have the following installed on your machine:
- Node.js (Version 16+)
- Git (optional, to clone the repo)

### 1️⃣ Setting Up the Server

The server handles downloading chunks, processing them with `FFmpeg`, and pushing metrics back.

1. Open your terminal and navigate to the backend directory:
   ```bash
   cd server
   ```
2. Install necessary dependencies:
   ```bash
   npm install
   ```
3. Start the Node.js API server:
   ```bash
   node index.js
   ```
   *The server runs locally on `http://localhost:4000`.*

### 2️⃣ Setting Up the Client

The client serves the beautiful user interface where users insert links and analyze videos.

1. Open a new terminal instance and navigate to the frontend directory:
   ```bash
   cd client
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Spin up the development environment:
   ```bash
   npm run dev
   ```
   *Usually, the Vite React app runs on `http://localhost:5173`. Check your console logs for the exact URL.*

---

## 🍪 Overcoming YouTube Bot Captchas

Downloading heavily restricted or large playlists from YouTube may sometimes result in connection refusals or bot verifications.

Aura TubeDown is specifically designed to bypass this:
- **Cookies.txt Configuration**: Manually export your browser cookies via extensions (such as 'Get cookies.txt LOCALLY') and place them as `cookies.txt` directly inside the `/server` directory. The application handles bot detection automatically using these authenticated cookies.
- **Dynamic Field Input**: The application allows injecting your browser cookie string manually from its frontend UI directly into the processing engine.

---

## 📂 Project Structure Overview

```text
yt-downloader/
├── client/                 # Frontend React Application
│   ├── src/                # Components and core layout 
│   ├── package.json        
│   └── vite.config.js      # Vite compilation setups
└── server/                 # Backend APIs and download handler
    ├── downloads/          # Temporarily holds downloaded files
    ├── index.js            # Core App Logic / socket.io listeners
    └── package.json        
```

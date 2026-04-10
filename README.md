<div align="center">
  <img src="./client/src/assets/hero.png" alt="Aura TubeDown Hero" width="800" />

  # 🎥 Aura TubeDown 

  **A sleek, robust, and highly advanced YouTube Media Downloader.**

  <p align="center">
    <a href="#features">Features</a> • 
    <a href="#tech-stack">Tech Stack</a> • 
    <a href="#quick-start">Quick Start</a> • 
    <a href="#bot-bypassing">Bot Bypassing</a>
  </p>

  ![License](https://img.shields.io/badge/License-MIT-blue.svg)
  ![React](https://img.shields.io/badge/React-19-61dafb.svg?logo=react)
  ![Node.js](https://img.shields.io/badge/Node.js-Express-339933.svg?logo=nodedotjs)
</div>

---

## 🌟 Overview

**Aura TubeDown** is a full-stack media downloading web application specifically engineered to bypass tight YouTube bot-detection algorithms while providing a beautiful, glassmorphic user interface. 

It handles everything from single videos to large playlists, merging high-resolution video streams with pristine audio tracks using FFmpeg under the hood.

## ✨ Core Features

*   🚀 **High-Speed Downloads**: Leverage `yt-dlp` heuristics to pull chunks simultaneously.
*   🎨 **Modern Glassmorphic UI**: Animated aesthetic backgrounds and polished interfaces crafted with React 19.
*   🛡️ **Advanced Bot Bypass Mechanism**: Dynamically injects browser cookies natively or via `cookies.txt` to seamlessly navigate around YouTube's "Sign in to confirm you're not a bot" CAPTCHAs.
*   📺 **Format Flexibility**: Auto-merged "Best Quality", 1080p, 720p, 480p, or Audio-only (MP3/M4A) selection matrix.
*   📡 **Live Socket Telemetry**: Built-in websocket connections emitting real-time download percentages, statuses, and ETA.
*   🗂 **Playlist Extraction**: Visually fetches and grids out entirely scraped playlists, allowing you to select format qualities uniformly across all queued videos.
*   ⏹️ **Halt & Cancel Operations**: Send instantaneous SIGTERM kills to the background download threads directly from the browser if you change your mind.

---

## 🛠️ Tech Stack

### Client (Frontend)
*   **React 19 & Vite:** Lightning-fast HMR and bleeding edge React optimization.
*   **Socket.IO Client:** Bi-directional event fetching for download processes.
*   **Vanilla CSS Module:** Zero-dependency modern CSS including CSS Grid, Flexbox, and Glassmorphism styling.
*   **Lucide React:** Beautiful, consistent SVGs.

### Server (Backend)
*   **Node.js & Express:** Rock solid REST API routing.
*   **Socket.IO:** Real-time event broadcasting to identical client sockets.
*   **Youtube-dl-exec:** Direct wrapper for the powerful `yt-dlp` tool.
*   **FFmpeg-Static:** Headless audio and video stream merging.

---

## 🚀 Quick Start (Local Setup)

The architecture is split into a standalone backend API and a client UI. Both must be running synchronously.

### 1. Prerequisites
Ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v16.0 or higher)
*   Git

### 2. Clone & Setup

```bash
git clone https://github.com/bhadrechadharmesh/Aura-TurboDown.git
cd Aura-TurboDown
```

### 3. Start the Backend Server

```bash
cd server
npm install
node index.js
```
> *Server will instantiate on `http://localhost:4000`*

### 4. Start the Frontend Application

Open a **new** terminal split:
```bash
cd client
npm install
npm run dev
```
> *Application binds to Vite's port, typically `http://localhost:5173`*

---

## 🍪 Bot Bypassing Mechanics

YouTube often refuses connections from standard downloading agents. Aura TubeDown provides two native methods to conquer bot verifications:

1. **Browser Native Selection**
   Using the frontend interface, you can select your active browser (Chrome, Edge, Firefox, Brave, Safari, Opera). `yt-dlp` will attempt to decrypt your local SQLite cookie database securely and pass it to YouTube. 

2. **The `cookies.txt` Method (For Windows/Encrypted DB Users)**
   If the native selection fails (often due to Windows 11 Chrome Data encryption), use a browser extension to export your Netscape cookies (e.g. *Get cookies.txt LOCALLY* extension). Drop that generated `cookies.txt` directly into the `server/` directory and ensure "None" is selected on the UI dropdown.

---

<div align="center">
  <p>Built with ❤️ for hassle-free media archiving.</p>
</div>

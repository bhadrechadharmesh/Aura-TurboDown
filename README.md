<div align="center">

  # 🎥 Aura TubeDown

  **A premium, full-stack YouTube media downloader with real-time progress tracking,  
  glassmorphic UI, and intelligent bot-detection bypass.**

  [![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react&logoColor=white)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-8.0-646cff?logo=vite&logoColor=white)](https://vite.dev/)
  [![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?logo=socketdotio&logoColor=white)](https://socket.io/)
  [![yt-dlp](https://img.shields.io/badge/Engine-yt--dlp-red?logo=youtube&logoColor=white)](https://github.com/yt-dlp/yt-dlp)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

  <br/>

  [Features](#-features) · [Tech Stack](#-tech-stack) · [Architecture](#-architecture) · [Getting Started](#-getting-started) · [API Reference](#-api-reference) · [Bot Bypass](#-youtube-bot-bypass)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Usage Guide](#-usage-guide)
- [API Reference](#-api-reference)
- [YouTube Bot Bypass](#-youtube-bot-bypass)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎬 **Single Video Downloads** | Fetch metadata, thumbnail, and download any YouTube video with a single URL paste. |
| 📋 **Full Playlist Support** | Scrape entire playlists into a visual grid — download individual videos with per-item controls. |
| 🎛️ **Quality Selector** | Choose from Best Quality (auto-merged), 1080p, 720p, 480p, or Audio-Only before downloading. |
| 📡 **Real-Time Progress** | WebSocket-driven live progress bars with percentage, speed, ETA and merge-status indicators. |
| ⏹️ **Cancel Downloads** | Instantly halt any in-progress download with a SIGTERM signal from the browser. |
| 🛡️ **Bot Detection Bypass** | Native browser cookie injection (Chrome, Edge, Firefox, Brave, Opera, Safari) or manual `cookies.txt` file support. |
| 🎨 **Premium Dark UI** | Animated glassmorphic interface with floating gradient blobs, smooth micro-animations, and the Outfit typeface. |
| 📱 **Responsive Design** | Fully responsive layout — works seamlessly on desktop and tablet viewports. |
| 🔒 **Security** | Server-side directory traversal protection on file downloads. |
| 🔀 **Auto Stream Merging** | Automatically merges separate video + audio streams into a single MP4 file via FFmpeg. |

---

## 🛠 Tech Stack

### Frontend — `/client`

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 19.2 | Component-based UI framework |
| [Vite](https://vite.dev/) | 8.0 | Build tool with lightning-fast HMR |
| [Socket.IO Client](https://socket.io/) | 4.8 | Real-time bidirectional event communication |
| [Lucide React](https://lucide.dev/) | 1.8 | Modern icon library (Search, Download, Video, etc.) |
| Vanilla CSS | — | Custom glassmorphism design system with CSS variables |
| [Google Fonts – Outfit](https://fonts.google.com/specimen/Outfit) | — | Premium display typography |

### Backend — `/server`

| Technology | Version | Purpose |
|---|---|---|
| [Node.js](https://nodejs.org/) | 16+ | Server runtime |
| [Express](https://expressjs.com/) | 5.2 | RESTful API routing & middleware |
| [Socket.IO](https://socket.io/) | 4.8 | Real-time WebSocket event broadcasting |
| [youtube-dl-exec](https://github.com/microlinkhq/youtube-dl-exec) | 3.1 | Node.js wrapper for `yt-dlp` |
| [ffmpeg-static](https://github.com/eugeneware/ffmpeg-static) | 5.3 | Bundled FFmpeg binary for stream merging |
| [CORS](https://github.com/expressjs/cors) | 2.8 | Cross-origin request handling |

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                     │
│                                                                  │
│  ┌──────────┐   ┌──────────────┐   ┌────────────────────────┐   │
│  │  App.jsx  │──▶│  InfoCard.jsx │   │  ProgressManager.jsx   │   │
│  │          │   │  (metadata)  │   │  (live download HUD)   │   │
│  └────┬─────┘   └──────────────┘   └──────────┬─────────────┘   │
│       │                                        │                 │
│       │  HTTP REST                    Socket.IO Events           │
│       │  (fetch info, start download)  (progress, completed,    │
│       │                                 error)                   │
└───────┼────────────────────────────────────────┼─────────────────┘
        │                                        │
        ▼                                        ▼
┌───────────────────────────────────────────────────────────────────┐
│                     SERVER (Node.js + Express)                    │
│                                                                   │
│  ┌─────────────┐   ┌──────────────┐   ┌──────────────────────┐   │
│  │ GET /api/info│   │POST /api/    │   │GET /api/download-file│   │
│  │  (yt-dlp    │   │  download    │   │  (serve completed    │   │
│  │   metadata) │   │  (spawn      │   │   files securely)    │   │
│  └─────────────┘   │   yt-dlp     │   └──────────────────────┘   │
│                     │   process)   │                              │
│                     └──────┬───────┘   ┌──────────────────────┐   │
│                            │           │POST /api/cancel      │   │
│                            ▼           │  (SIGTERM to process)│   │
│                     ┌──────────────┐   └──────────────────────┘   │
│                     │   yt-dlp     │                              │
│                     │   + FFmpeg   │                              │
│                     │  (merge a/v) │                              │
│                     └──────┬───────┘                              │
│                            ▼                                      │
│                     ┌──────────────┐                              │
│                     │  /downloads/ │                              │
│                     │  (temp store)│                              │
│                     └──────────────┘                              │
└───────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User pastes a URL** → Client sends `GET /api/info` with the video/playlist URL.
2. **Server responds** with `yt-dlp --dump-single-json` metadata (title, thumbnail, formats, duration).
3. **User selects quality and clicks Download** → Client sends `POST /api/download` with the socket ID.
4. **Server spawns a `yt-dlp` child process** → stdout is parsed for progress regex matches.
5. **Progress events** are emitted in real-time via Socket.IO to the specific client socket.
6. **On completion**, the server emits a `completed` event with a secure download URL.
7. **User clicks "Save to Computer"** → `GET /api/download-file` streams the file with directory traversal protection.

---

## 📂 Project Structure

```
yt-downloader/
│
├── client/                          # React Frontend Application
│   ├── public/
│   │   ├── favicon.svg              # App favicon
│   │   └── icons.svg                # SVG icon sprite
│   ├── src/
│   │   ├── assets/
│   │   │   └── hero.png             # Hero/banner image
│   │   ├── components/
│   │   │   ├── InfoCard.jsx         # Video metadata display + format selector
│   │   │   └── ProgressManager.jsx  # Floating download progress HUD
│   │   ├── App.jsx                  # Main application component
│   │   ├── App.css                  # Component-specific styles
│   │   ├── index.css                # Global design system (glassmorphism, animations)
│   │   └── main.jsx                 # React DOM entry point
│   ├── index.html                   # HTML shell
│   ├── vite.config.js               # Vite build configuration
│   └── package.json
│
├── server/                          # Node.js Backend API
│   ├── downloads/                   # Temporary file storage (auto-created)
│   ├── index.js                     # Express server, Socket.IO, yt-dlp integration
│   └── package.json
│
├── .gitignore                       # Git ignore rules
└── README.md                        # This file
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Minimum Version | Download |
|---|---|---|
| Node.js | v16.0+ | [nodejs.org](https://nodejs.org/) |
| npm | v8.0+ | Bundled with Node.js |
| Git | Latest | [git-scm.com](https://git-scm.com/) |

> **Note:** `yt-dlp` and `FFmpeg` are **automatically bundled** — no separate installation needed.

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/bhadrechadharmesh/Aura-TurboDown.git

# 2. Navigate into the project
cd Aura-TurboDown

# 3. Install server dependencies
cd server
npm install

# 4. Install client dependencies
cd ../client
npm install
```

### Running the Application

You need **two terminal windows** running simultaneously:

**Terminal 1 — Backend Server:**
```bash
cd server
node index.js
```
```
✅ Server listening on port 4000
```

**Terminal 2 — Frontend Dev Server:**
```bash
cd client
npm run dev
```
```
✅ Local: http://localhost:5173/
```

Open your browser and navigate to **`http://localhost:5173`** to start using the app.

---

## 📖 Usage Guide

### Downloading a Single Video

1. **Paste** a YouTube video URL into the search bar  
2. Click **"Analyze"** to fetch video metadata  
3. Review the **thumbnail**, **title**, **channel**, and **duration**  
4. Select your preferred **quality** (Best, 1080p, 720p, 480p, Audio Only)  
5. Click **"Download Source"**  
6. Watch the **real-time progress bar** in the bottom-right corner  
7. Once complete, click **"Save to Computer"** to download the file  

### Downloading a Playlist

1. **Paste** a YouTube playlist URL  
2. Click **"Analyze"** — all videos appear in a **grid layout**  
3. Select a **uniform quality** for the entire playlist  
4. Click **"Download"** on any individual video card  
5. Track multiple downloads simultaneously via stacked progress indicators  

### Cancelling a Download

- Click the **"Stop"** button on any active progress bar to immediately cancel the download process.

---

## 📬 API Reference

### `GET /api/info`

Fetch video or playlist metadata.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `url` | `string` | ✅ | YouTube video or playlist URL |
| `browserCookie` | `string` | ❌ | Browser name for cookie injection (`chrome`, `edge`, `firefox`, `brave`, `opera`, `safari`, `none`) |

**Response:** Full `yt-dlp --dump-single-json` output (title, thumbnail, formats, duration, entries for playlists).

---

### `POST /api/download`

Start a download process.

| Body Field | Type | Required | Description |
|---|---|---|---|
| `url` | `string` | ✅ | YouTube video URL |
| `formatId` | `string` | ❌ | yt-dlp format selector (default: `bestvideo+bestaudio/best`) |
| `socketId` | `string` | ✅ | Client's Socket.IO ID for progress events |
| `browserCookie` | `string` | ❌ | Browser name for cookie injection |

**Socket Events Emitted:**

| Event | Payload | Description |
|---|---|---|
| `progress` | `{ url, percent, text }` | Download progress update |
| `completed` | `{ url, downloadUrl, message }` | Download finished successfully |
| `error` | `{ url, message }` | Download failed or was cancelled |

---

### `POST /api/cancel`

Cancel an active download.

| Body Field | Type | Required | Description |
|---|---|---|---|
| `url` | `string` | ✅ | URL of the download to cancel |
| `socketId` | `string` | ✅ | Client's Socket.IO ID |

---

### `GET /api/download-file`

Download a completed file to the user's machine.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `filename` | `string` | ✅ | Name of the file in the downloads directory |

> 🔒 **Security:** Path traversal attacks are mitigated via `path.basename()` sanitization.

---

## 🛡 YouTube Bot Bypass

YouTube frequently blocks automated download tools with CAPTCHA challenges. Aura TubeDown offers **two methods** to bypass this:

### Method 1: Browser Cookie Auto-Injection (Recommended)

Select your browser from the dropdown in the UI. The server uses `yt-dlp --cookies-from-browser <browser>` to extract your authenticated YouTube session.

| Browser | Support | Notes |
|---|---|---|
| Chrome | ✅ | May fail on Windows due to encrypted cookie DB |
| Edge | ✅ | Same encryption caveat as Chrome |
| Firefox | ✅ Best | Unencrypted cookie DB — most reliable on all OS |
| Brave | ✅ | Chromium-based, same caveats as Chrome |
| Opera | ✅ | Chromium-based |
| Safari | ✅ | macOS only |

### Method 2: Manual `cookies.txt` File (Most Reliable)

If auto-injection fails (common on Windows 11 with Chrome/Edge):

1. Install a browser extension: [**Get cookies.txt LOCALLY**](https://chromewebstore.google.com/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc)
2. Navigate to [youtube.com](https://youtube.com) and ensure you're **signed in**
3. Click the extension icon → **Export** cookies
4. Save the file as **`cookies.txt`** inside the `server/` directory
5. In the Aura TubeDown UI, set Bot Protection to **"None"**

The server automatically detects and uses `cookies.txt` when no browser cookie is selected.

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <br/>
  <strong>Built with ❤️ by <a href="https://github.com/bhadrechadharmesh">Dharmesh Bhadrecha</a></strong>
  <br/><br/>
  <sub>⭐ Star this repo if you found it useful!</sub>
</div>

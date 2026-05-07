# Twitch Chat Overlay 🎮

A sleek, lightweight, and fully transparent Twitch Chat Overlay built with Electron and `tmi.js`. Designed specifically for single-monitor setups, it allows you to read Twitch chat over your games or applications seamlessly without interrupting your gameplay.

## ✨ Features

* **Transparent & Click-Through:** The chat overlay is entirely transparent. When you aren't in "Edit Mode," your mouse clicks go right through it, allowing you to interact with your game undisturbed.
* **Modern Control UI:** A beautifully designed, glassmorphic Control Window to easily configure your overlay.
* **Global & Custom Badges:** 
  * Instantly loads standard Twitch global badges (Subscriber, Broadcaster, VIP, Founder, Mod) with zero setup.
  * Supports fetching **Channel-Specific Custom Badges** (like unique Sub/VIP icons) via the official Twitch API.
* **Third-Party Emotes:** Built-in automatic support for fetching emotes from **BetterTTV (BTTV)**, **FrankerFaceZ (FFZ)**, and **7TV** (both Global and Channel-specific).
* **Draggable & Resizable:** Simply toggle "Edit Mode" from the main menu or system tray to drag the overlay anywhere on your screen and resize it to your preference.
* **Security Hardened:** Features a secure implementation with XSS protection, context isolation, disabled node integration in the renderer, and strict Content Security Policies (CSP).

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/twitch-chat-overlay.git
   cd twitch-chat-overlay
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Run the app in development mode:
   ```bash
   npm start
   ```

## 🛠️ Building for Production (Windows)

If you want to create a standalone `.exe` file that you can launch without opening a terminal, you can package the app using the built-in build script:

```bash
npm run build
```

The compiled application executable will be generated inside the `dist/` folder.

## 🎮 Usage Guide

1. **Launch the App:** The main Control Window will appear.
2. **Connect to a Channel:** Enter the Twitch username of the channel you want to view (e.g., `shroud`) and click "Connect to Chat".
3. **Position the Overlay (Edit Mode):** 
   - Click the **"Enter Edit Mode"** button (or toggle it from the System Tray icon menu in the bottom right corner).
   - A purple drag bar will appear at the top of the chat. **Click and drag the bar** to move the window, or **drag the edges** to resize it.
   - Once you are satisfied with the position, click the **"Finish"** button to exit Edit Mode. The chat will become click-through again.
4. **Hide the Control Window:** You can safely close the main Control Window. The application will continue running in the background and minimize to the **System Tray** (the small chat icon in the bottom right corner of your taskbar). You can right-click this icon to re-enter Edit Mode, bring up the control window, or quit the app.

## ⚙️ Advanced Settings (Custom Channel Badges)

By default, the app uses standard Twitch badges (e.g., a generic star for subscribers). If you want to see the **streamer's custom badge designs**, you need to provide Twitch Developer credentials.

1. Go to the [Twitch Developer Console](https://dev.twitch.tv/console).
2. Log in and click **Register Your Application**.
   * **Name:** (Anything you like)
   * **OAuth Redirect URLs:** `http://localhost`
   * **Category:** Chat Bot
3. Click Create, then click **Manage** to find your **Client ID**.
4. Click **New Secret** to generate a **Client Secret**.
5. Open the Twitch Chat Overlay app, click the **⚙️ (Gear Icon)** in the top right corner, and paste your credentials. 

The application securely stores these credentials locally on your machine. The next time you connect to a channel, it will instantly fetch and display their custom badges!

## 📜 License

This project is licensed under the ISC License.

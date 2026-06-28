# 🌌 shuraOS v4.0.0

```text
       _                      ____   ____  
  ___| |__  _   _ _ __ __ _ / __ \ / ___| 
 / __| '_ \| | | | '__/ _` | |  | |`___ \ 
 \__ \ | | | |_| | | | (_| | |__| | ___) |
 |___/_| |_|\__,_|_|  \__,_|\____/|____/  
                                          
 [ KERNEL VERSION 4.0.0 ] // [ LICENSE: GNU GPL v3 ]
```

**shuraOS** is an interactive web-desktop portfolio inspired by the KDE desktop environment, with visual and atmospheric influences drawn from Sci-Fi/Cyberpunk games and anime. It showcases projects, certificates, and skills in a fully simulated OS environment complete with running apps, desktop widgets, and system controls.

---

## 🛠️ System Overview & Specifications

| Subsystem | Specification |
| :--- | :--- |
| **Codename** | shuraOS |
| **Inspiration** | KDE Desktop Environment + Sci-Fi Games & Anime |
| **Engine** | Next.js 16 (App Router + Turbopack) |
| **Styles / Animations** | Styled Components + Framer Motion |
| **3D Subsystem** | Three.js + React Three Fiber |
| **License** | GNU GPL v3.0 |

---

## 🛰️ Core Features & Applications

### 🖥️ KDE-Inspired Web Desktop
*   **System Controls & Clock**: Portaled React overlays mapped to `document.body` for perfect, unobstructed `backdrop-filter` glassmorphism rendering.
*   **Taskbar & Navigation**: Interactive bottom/top panel housing system settings, theme toggles, a media player widget, and clock controls.

### 🎮 Netrunner HUD (Quickhack Combat Simulator)
*   **Game Mode**: An immersive mini-hacking combat simulator inspired by sci-fi gaming HUDs.
*   **Resolution Check**: Requires a minimum desktop resolution of `1200 x 700` (with warning screens and force-connect overrides on smaller viewports).
*   **Controls**: Includes disconnect options mapped to `ESC` and dedicated header close buttons.

### 💻 VSCode Certificate Explorer
*   **IDE Simulation**: A high-fidelity VSCode-style explorer to navigate professional certifications and credentials.
*   **Dynamic Data**: Loaded directly from a centralized database configuration [certificates.json](file:///home/shura/Projects/Portfolio/src/data/certificates.json).
*   **Modes**: Seamless toggle between rendering the verified credential thumbnail or viewing a mockup React source definition.

### 🎵 Desktop Media Player
*   **Audio Engine**: Desktop widget handling background music, track listings, skip controls, and volume adjustments.

---

## ⚙️ Boot Sequence (Local Setup)

### 1. Resolve Dependencies
Clone the repository and install the required modules:
```bash
npm install
```

### 2. Boot Local Server
```bash
npm run dev
```

### 3. Production Compilation
```bash
npm run build
```

---

## 📂 Project Architecture

```text
├── app/                       # Next.js App Router core (pages & layouts)
├── public/                    # Static assets (3D models, audio, certificate files)
└── src/
    ├── components/            # React layout & app controls
    │   ├── apps/              # Specific applications (Music, Terminal, Netrunner HUD)
    │   └── sections/          # Core section views (About, Certifications, Achievements)
    ├── context/               # State management (AppsContext, ThemeContext)
    ├── data/                  # JSON files for certificates & skills
    ├── styles/                # Global style sheets & themes
    └── themes/                # Color palettes for multiple OS visual modes
```

---

## 🛡️ License

Released under the **GNU General Public License v3.0**. See the [LICENSE](file:///home/shura/Projects/Portfolio/LICENSE) file for complete copyleft terms and conditions.

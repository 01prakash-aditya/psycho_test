# 🚦 DMRC/LMRC/NMRC Psycho Test — Signal Color Identification

A web-based clone of the **DMRC/LMRC/NMRC Machine Psycho Test** used in Indian Metro Rail Corporation recruitment exams. This test evaluates a candidate's **reaction time**, **color perception**, and **decision-making speed** by presenting traffic signal colors (Red, Yellow, Green) that must be identified within a 60-second window.

---

## 📸 Screenshots

### Landing Page
- Clean, modern UI with test instructions and animated signal previews
- Start button to begin the 60-second psycho test

### Test Screen
- Realistic traffic signal images displayed one at a time
- Countdown timer (60 seconds) in the header
- Fullscreen toggle for distraction-free testing
- On-screen keyboard shortcut guide

### Results Report
- Pass/Fail verdict based on accuracy and reaction time
- Summary statistics (Total, Correct, Wrong, Missed, Accuracy %, Avg Reaction Time)
- Detailed per-signal breakdown table with Diffusion Time and Comeback Time

---

## 🎮 How It Works

### Test Flow
1. **Press `L`** → A random traffic signal image appears (Red, Yellow, or Green)
2. **Identify the color** → Press the matching key:
   - `R` → Red
   - `Y` → Yellow
   - `G` → Green
3. **Signal locks** → Once a signal appears, `L` is locked until you answer
4. **After answering** → Press `L` again for the next signal
5. **Auto-change** → If no answer within **5 seconds**, the signal is recorded as "Missed" and auto-advances
6. **Test ends** → After 60 seconds, a comprehensive results report is shown

### Keyboard Controls
| Key | Action |
|-----|--------|
| `L` | Load next signal picture |
| `R` | Answer Red |
| `Y` | Answer Yellow |
| `G` | Answer Green |

### Results Report Columns
| Column | Description |
|--------|-------------|
| **Index** | Signal sequence number |
| **Your Input** | The key you pressed (R/Y/G or `-` if missed) |
| **Required** | The correct answer |
| **Result** | Right / Wrong / Missed |
| **Diffusion Time (Secs)** | Time taken from signal appearance to your answer |
| **Comeback Time** | Time between consecutive answers |

### Pass/Fail Criteria
- ✅ **Pass**: ≥ 80% accuracy AND average reaction time < 3 seconds
- ❌ **Fail**: Below either threshold

---

## 🛠️ Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Modern styling with animations, gradients, and responsive design
- **Vanilla JavaScript** — Zero dependencies, pure JS logic
- **Google Fonts** — Inter typeface for clean typography

No frameworks. No build tools. No npm dependencies required to run.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or later) — only needed for the dev server
- A modern web browser (Chrome, Edge, Firefox, Safari)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/01prakash-aditya/psycho_test.git
   cd psycho_test
   ```

2. **Start the development server**
   ```bash
   npx -y http-server . -p 3000 -c-1
   ```

3. **Open in browser**
   ```
   http://localhost:3000
   ```

### Alternative: Open Directly
Since this is a pure HTML/CSS/JS project, you can also just open `index.html` directly in your browser — no server needed. However, using `http-server` is recommended for proper asset loading.

---

## 📁 Project Structure

```
psycho_test/
├── index.html          # Main HTML — Landing, Test, and Results pages
├── styles.css          # Complete stylesheet with animations and responsive design
├── app.js              # Core test logic — timer, signals, keyboard, scoring
├── package.json        # NPM config with dev server script
├── README.md           # This file
└── images/
    ├── signal_red.png      # Red traffic signal (variant 1)
    ├── signal_red_2.png    # Red traffic signal (variant 2)
    ├── signal_yellow.png   # Yellow traffic signal (variant 1)
    ├── signal_yellow_2.png # Yellow traffic signal (variant 2)
    ├── signal_green.png    # Green traffic signal (variant 1)
    └── signal_green_2.png  # Green traffic signal (variant 2)
```

---

## ⚙️ Configuration

You can adjust test parameters in `app.js`:

```javascript
const TEST_DURATION = 60;           // Test duration in seconds
const AUTO_CHANGE_TIMEOUT = 5000;   // Auto-change timeout in milliseconds
```

---

## 🌟 Features

- ✅ **60-second timed test** with live countdown
- ✅ **Realistic traffic signal images** — 6 different photos (2 per color)
- ✅ **Fullscreen mode** for immersive testing
- ✅ **L-key locking** — prevents accidental rapid signal changes when key is held
- ✅ **Auto-change timer** — signals auto-advance after 5 seconds if unanswered
- ✅ **Detailed results report** — per-signal breakdown with reaction metrics
- ✅ **Pass/Fail verdict** based on accuracy and speed
- ✅ **Responsive design** — works on desktop and tablet
- ✅ **Zero dependencies** — runs with just a static file server
- ✅ **Keyboard-only interaction** — no mouse needed during the test

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

---

## 👤 Author

**Aditya Prakash**
- GitHub: [@01prakash-aditya](https://github.com/01prakash-aditya)

---

> **Disclaimer**: This is an educational clone for practice purposes. It is not affiliated with or endorsed by DMRC, LMRC, NMRC, or any official metro corporation body.

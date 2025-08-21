# 🎮 Tic-Tac-Toe Battle (マルバツバトル)

A modern and beautiful tic-tac-toe game with dark mode, color-blind accessibility, animation effects, and audio system - a comprehensive web application.

## 🚀 Demo

**▶️ [Play the Game](https://yamamax55.github.io/tic-tac-toe-game/)**

## ✨ Features

### 🎯 Game Modes
- **2 Players**: Play with friends
- **vs CPU**: Two difficulty levels
  - **Expert Mode**: Perfect AI using Minimax algorithm
  - **Beginner Mode**: AI with moderate difficulty for enjoyable play

### 🎨 Themes & Visual Design
- **Light/Dark Mode**: 🌙☀️ One-click toggle
- **Color-Blind Support**: 👁️ Blue/orange color scheme for red-green color blindness
- **4 Background Themes**: 
  - 🌟 **Space**: Twinkling stars and deep space gradient
  - 🌊 **Ocean**: Wave effects and blue gradient
  - 🌲 **Forest**: Green breathing natural background
  - ⚪ **Default**: Clean and refined design
- **Responsive Design**: 📱 Full mobile and tablet support
- **Touch Optimization**: Tap areas 44px or larger

### 🎬 Animations & Effects
- **Symbol Placement**: Bounce & rotation animations
- **Victory Effects**: Winning line lights up sequentially
- **Theme-specific Particle Effects**: Beautiful victory animations
  - 🎆 **Default**: Colorful firework explosions
  - ⭐ **Space**: Star rain (⭐✨💫🌟)
  - 💧 **Ocean**: Bubble rising effects
  - 🍃 **Forest**: Falling leaves (🍃🌿🍀)
- **Hover Effects**: Cell floating animations
- **Victory Announcement**: Pulse animations

### 🔊 Audio System
- **BGM**: Ambient music with beautiful chord progressions
- **Sound Effects**: Click sounds, victory sounds, draw sounds
- **Volume Control**: Individual BGM/SFX on/off

### 📊 Score & Statistics
- **Detailed Scores**: Win records by player and mode
- **Draw Records**: Draw games also counted
- **Real-time Updates**: Scores update immediately upon game completion

## 🛠️ Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: 
  - CSS Grid Layout (game board)
  - Flexbox (responsive layout)
  - CSS Animations (keyframe animations)
  - CSS Variables (theme switching)
  - Media Queries (responsive design)
- **Vanilla JavaScript**:
  - Minimax Algorithm (AI implementation)
  - Web Audio API (audio system)
  - LocalStorage (settings storage)
  - DOM Manipulation (dynamic UI)
- **Security Features**:
  - Content Security Policy (CSP)
  - XSS Protection with input sanitization
  - Secure localStorage validation
  - Dangerous function blocking
- **GitHub Pages**: Static site hosting

## 🎮 How to Play

### Basic Operations
1. **Game Mode Selection**: 2 Players or vs CPU
2. **CPU Battle Settings** (for vs CPU):
   - Symbol Selection: ◯ (First) or × (Second)
   - Difficulty Selection: Expert or Beginner
3. **Game Start**: Click cells to place symbols
4. **Winning Condition**: Align 3 symbols vertically, horizontally, or diagonally

### Theme Settings
- **🌙/☀️ Button**: Dark mode toggle
- **👁️ Button**: Color-blind mode toggle
- **Background Theme Selection**: Choose from Default, Space, Ocean, Forest
- Settings are automatically saved and maintained for future visits

### Audio Settings
- **BGM Button**: Background music on/off
- **SFX Button**: Sound effects on/off

## 🏗️ Local Development

### Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (recommended)

### Setup

```bash
# Clone repository
git clone https://github.com/yamamax55/tic-tac-toe-game.git

# Move to project directory
cd tic-tac-toe-game

# Start local server (example: Python)
python -m http.server 8000

# Access in browser
# http://localhost:8000
```

### File Structure

```
tic-tac-toe-game/
├── index.html          # Main HTML file
├── style.css           # Stylesheet
├── security.js         # Security protection module
├── claude_voice.js     # Voice notification system
├── voice_notify.ps1    # VOICEVOX PowerShell script
├── security-test.html  # Security test suite
├── README.md           # Project documentation
├── SECURITY.md         # Security implementation guide
└── CLAUDE.md           # Claude AI development guide
```

## 🎯 Future Improvements

### High Priority
- [ ] 4×4 board mode (more strategic gameplay)
- [ ] Custom symbol selection (options beyond ◯×)
- [ ] Detailed statistics and graph display (win rate analysis, time series data)

### Medium Priority
- [ ] Achievement and badge system (levels, challenge features)
- [ ] PWA support (offline functionality, home screen installation)
- [ ] Keyboard controls (accessibility improvement)

### Low Priority
- [ ] Online multiplayer functionality (WebSocket implementation)
- [ ] Multi-language support (internationalization)
- [ ] Music customization (BGM type selection)

## 🤝 Contributing

Pull requests and issue reports are welcome!

1. Fork this repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Create pull request

## 📝 License

This project is released under the MIT License.

## 👨‍💻 Author

**yamamax55** - [GitHub](https://github.com/yamamax55)

---

⭐ このプロジェクトが気に入ったら、ぜひスターを付けてください！
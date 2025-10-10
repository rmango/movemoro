# Movemoro - Move More, Get More Done

A gamified Pomodoro timer that motivates you to stay active by requiring exercise breaks between work sessions. Complete quick "exercise snacks" to unlock your breaks, and do optional longer exercises to extend your break time.

![Movemoro Preview](https://via.placeholder.com/800x400?text=Movemoro+Screenshot)

## Features

### Core Functionality
- **Pomodoro Timer**: Customizable work (default 25min) and break (default 5min) durations
- **Exercise Unlock System**: Choose and complete a quick exercise to unlock your break
- **Break Extension**: Optionally complete longer exercises during breaks to earn extra break time
- **Session Tracking**: Visual progress indicators showing your current session cycle
- **Smart Exercise Selection**: Exercises filtered to avoid repetition

### Customization
- **5 Themes**: Professional, Zen, Retro Gaming, Gym Bro, and Cozy Cafe
  - Each theme includes custom visuals, messaging, and tone
- **Exercise Preferences**:
  - Filter by difficulty (Easy, Medium, Hard)
  - Exclude floor exercises (office-friendly mode)
  - Exclude exercises requiring equipment
- **Flexible Settings**: Adjust work duration, break duration, long break duration, and sessions per cycle

### Exercise Library
- **Office-appropriate exercises**: No floor contact, quiet, desk-friendly
- **Home-friendly exercises**: More variety, can use floor and equipment
- **Quick "snack" exercises**: 30-90 seconds to unlock breaks
- **Extension exercises**: 3-10 minutes to earn bonus break time

### User Experience
- **Welcome Tutorial**: First-time user guide
- **Audio Notifications**: Optional sound alerts for timer completion
- **Fullscreen Mode**: Distraction-free focus experience
- **Responsive Design**: Works on desktop and mobile
- **Local Storage**: Settings and preferences persist between sessions

## Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pomodoro.git
   cd pomodoro
   ```

2. **Open in browser**
   Simply open `index.html` in your web browser. No build process or server required!

### Usage

1. **First Time Setup**
   - The welcome panel will guide you through the basics
   - Click "Start Your First Session" to begin

2. **Work Session**
   - Click the play button to start your 25-minute focus session
   - Work on your tasks without interruption

3. **Exercise Break**
   - When the timer completes, choose one of two exercises:
     - **Office**: Suitable for workplace environments
     - **Home**: More flexibility with movement
   - Complete the exercise and click "Confirm Completion"

4. **Rest Break**
   - Enjoy your earned break time
   - Optional: Choose a longer exercise to extend your break
   - When break ends, start your next work session

5. **Customize**
   - Click the settings icon to adjust durations, themes, and preferences
   - Settings save automatically

## Project Structure

```
pomodoro/
├── index.html              # Main application page
├── src/
│   ├── css/
│   │   ├── variables.css   # CSS custom properties
│   │   ├── main.css        # Core styles
│   │   ├── timer.css       # Timer component styles
│   │   ├── modal.css       # Modal and form styles
│   │   ├── welcome.css     # Welcome panel styles
│   │   └── themes/         # Theme-specific styles
│   │       ├── zen.css
│   │       ├── retro.css
│   │       ├── gymbro.css
│   │       └── cafe.css
│   ├── js/
│   │   ├── app.js          # Main application logic
│   │   ├── timer.js        # Timer class
│   │   ├── audio.js        # Audio manager
│   │   ├── exercises.js    # Exercise manager
│   │   ├── storage.js      # LocalStorage manager
│   │   ├── theme.js        # Theme manager
│   │   └── achievements.js # Achievement definitions (future)
│   └── data/
│       └── exercises.json  # Exercise database
└── README.md
```

## Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, flexbox, grid, animations
- **Vanilla JavaScript**: No frameworks or dependencies
- **Web Audio API**: Notification sounds
- **LocalStorage API**: Settings persistence

## Browser Support

Movemoro works in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Configuration

### Settings

All settings are accessible via the settings modal (gear icon):

| Setting | Default | Description |
|---------|---------|-------------|
| Work Duration | 25 min | Length of focus sessions |
| Break Duration | 5 min | Length of short breaks |
| Long Break Duration | 15 min | Length of long breaks |
| Sessions Before Long Break | 4 | Number of sessions before earning a long break |
| Enable Audio | On | Toggle notification sounds |
| Theme | Professional | Visual theme selection |
| Preferred Difficulty | Any | Filter exercises by difficulty |
| Exclude Floor Exercises | Off | Remove exercises requiring lying down |
| Exclude Equipment | Off | Remove exercises needing equipment |

## Future Enhancements

- Statistics dashboard with charts and graphs
- Streak tracking and achievements system
- Browser notifications for desktop alerts
- Cloud sync with user accounts
- Custom exercise creation
- PWA support for offline use
- Social features and leaderboards

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the Pomodoro Technique® by Francesco Cirillo
- Exercise database curated from evidence-based movement science
- Built with a focus on accessibility and user experience

## Contact

For questions, suggestions, or feedback, please open an issue on GitHub.

---

**Stay focused. Stay active. Get more done with Movemoro!** 💪⏲️

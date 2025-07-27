# The River - A Cozy Adventure Game

A web-based narrative adventure about a retired adventurer embarking on one final journey down a river, collecting fellow retirees and preparing for a grand dinner party with an old "Dark Lord" at journey's end.

## 🎮 Game Overview

**The River** is a cozy, narrative-driven adventure that celebrates the wisdom and warmth that comes with age. Players take on the role of a retired adventurer who purchases a modest boat and sets off on a peaceful river journey, recruiting companions and learning domestic skills like cooking and cleaning along the way.

### Key Features

- **Cozy Gameplay**: Focus on cooking, cleaning, and relationship building rather than combat
- **Companion System**: Recruit and build relationships with fellow retired adventurers
- **Cooking Mechanics**: Learn recipes, combine ingredients, and create meals with cultural significance
- **Narrative Choices**: Make meaningful decisions that affect your journey and relationships
- **Accessibility**: Built with accessibility in mind, including reduced motion and high contrast options
- **Progressive Web App**: Play in your browser with offline support

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Local web server for development (VS Code Live Server recommended)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/triptych/the-river.git
cd the-river
```

2. Open the project in VS Code and start Live Server, or use any local web server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

3. Navigate to `http://localhost:8000/src/` in your browser

## 🎯 How to Play

1. **Character Creation**: Choose your retired adventurer class (Knight, Wizard, Rogue, Ranger, or Cleric)
2. **River Journey**: Travel down the river, stopping at villages and meeting potential companions
3. **Cooking & Cleaning**: Learn domestic skills and create meals with your companions
4. **Relationship Building**: Develop friendships and learn from each companion's unique background
5. **Final Dinner**: Prepare for the grand dinner party with Archlich Mortimer the Formerly Terrible

### Controls

- **Mouse/Touch**: Primary interaction method
- **Keyboard Shortcuts** (in-game):
  - `I` - Open Inventory
  - `C` - View Companions
  - `R` - Recipe Book
  - `ESC` - Close modals

## 🛠️ Development

### Project Structure

```
src/
├── index.html              # Main game file
├── css/
│   ├── main.css            # Core styles and layout
│   └── components/
│       ├── ui.css          # UI component styles
│       └── animations.css  # Animation definitions
├── js/
│   ├── main.js             # Main game controller
│   ├── utils/
│   │   ├── storage.js      # Save/load functionality
│   │   └── helpers.js      # Utility functions
│   └── systems/            # Game system modules (to be implemented)
├── assets/                 # Game assets (images, audio, data)
└── docs/                   # Additional documentation
```

### Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Storage**: LocalStorage for save games and settings
- **Graphics**: CSS animations and transitions
- **Audio**: Web Audio API (planned)
- **Testing**: Jest (planned)

### Development Roadmap

The game is being developed in phases:

- **Phase 1** (Weeks 1-8): Foundation & Prototype ✅
- **Phase 2** (Weeks 9-20): Core Gameplay Systems
- **Phase 3** (Weeks 21-32): World Building & Content
- **Phase 4** (Weeks 33-40): Advanced Features & Polish
- **Phase 5** (Weeks 41-48): Launch Preparation

See [tasks.md](tasks.md) for detailed development timeline.

## 🎨 Art Direction

The game features a warm, watercolor-inspired aesthetic with:

- **Color Palette**: Warm, inviting tones (sandy browns, golden yellows, soft greens)
- **Character Design**: Age represented with dignity and warmth
- **Environments**: Cozy, lived-in spaces with golden hour lighting
- **UI Design**: Hand-drawn style elements with organic shapes

See [art_assets_list.md](art_assets_list.md) for complete art specifications.

## 📖 Story & Characters

### Main Characters

- **The Protagonist**: Customizable retired adventurer
- **Archlich Mortimer the Formerly Terrible**: Reformed undead host who loves cooking
- **12+ Companions**: Each with unique backgrounds, skills, and personalities

### Companion Examples

- **Gruff the Gentle**: Former barbarian, now expert at meat preservation
- **Dame Ironheart**: Retired paladin obsessed with cleanliness and organization
- **Sage Moonwhisper**: Elderly wizard who knows magical cooking recipes
- **Trickster Nim**: Reformed rogue-mage, expert at "acquiring" rare ingredients

## 🎮 Game Mechanics

### Core Systems

- **Cooking System**: Recipe discovery, ingredient combination, cultural fusion
- **Companion System**: Recruitment, relationship building, skill synergies
- **Inventory Management**: Weight-based capacity, item quality, spoilage
- **Boat Management**: Capacity limits, upgrades, maintenance
- **Skill Progression**: Cooking, cleaning, and social skill development

### "Cozy Combat"

Instead of traditional combat, conflicts are resolved through:
- Cooking competitions
- Cleaning challenges
- Storytelling contests
- Collaborative problem-solving

## 🌟 Accessibility Features

- **Reduced Motion**: Respects user's motion preferences
- **High Contrast**: Enhanced visibility options
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Semantic HTML and ARIA labels
- **Scalable Text**: Adjustable text size options
- **Colorblind Support**: Colorblind-friendly visual indicators

## 🤝 Contributing

This is currently a solo development project, but feedback and suggestions are welcome! Please feel free to:

1. Report bugs or issues
2. Suggest features or improvements
3. Share feedback on game design
4. Contribute to documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 👨‍💻 Author

**Andrew Wooldridge**
- GitHub: [@triptych](https://github.com/triptych)
- Project: [The River](https://github.com/triptych/the-river)

## 🙏 Acknowledgments

- Inspired by cozy games like Stardew Valley, Animal Crossing, and Spiritfarer
- Special thanks to the cozy gaming community for inspiration and support
- Built with love for players who appreciate slower-paced, meaningful gaming experiences

## 📊 Project Status

**Current Status**: Phase 1 Complete - Foundation & Prototype
- ✅ Project structure and core architecture
- ✅ Basic UI and navigation
- ✅ Save/load system
- ✅ Character creation
- ✅ Settings and accessibility features
- 🔄 Core gameplay systems (in progress)

---

*"Sometimes the most meaningful adventures happen when we slow down and appreciate the journey itself."*

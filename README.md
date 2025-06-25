# Wim Hof Breathing App

A modern, comprehensive React Native app focused on the Wim Hof Method, featuring beautiful animations, custom breathing routines, and an intuitive user experience.

## 🎯 Overview

This app provides a complete platform for practicing the Wim Hof breathing technique with:
- **Preset Routines**: Curated breathing patterns for different skill levels
- **Custom Routines**: User-created breathing sequences
- **Real-time Guidance**: Visual breathing animations and phase indicators
- **Progress Tracking**: Session completion and performance metrics
- **Modern UI**: 3D effects, gradients, and smooth animations

## ✨ Features

### Core Functionality
- **Wim Hof Breathing Sessions**: Guided breathing with visual feedback
- **Custom Routine Creation**: Build personalized breathing patterns
- **Routine Management**: Save, edit, and delete custom routines
- **Profile System**: User profiles with progress tracking
- **Search & Discovery**: Find routines by name or instructor

### User Experience
- **Modern Design**: 3D effects, smooth animations, gradient backgrounds
- **Color Coding**: Intuitive routine identification with unique gradients
- **Smart Navigation**: Context-aware back buttons and routing
- **Responsive Layout**: Adaptive design for different screen sizes
- **Gesture Support**: Swipe-to-go-back functionality

### Technical Features
- **TypeScript**: Full type safety and better development experience
- **Expo Router**: Modern navigation with file-based routing
- **AsyncStorage**: Local data persistence for user data
- **Animation System**: Consistent 300ms slide transitions
- **Performance Optimized**: 60fps animations with native driver

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mediation-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your device

## 📱 App Structure

```
app/
├── (tabs)/           # Tab-based navigation screens
│   ├── index.tsx     # Home screen with quick actions
│   ├── explore.tsx   # Discover and search routines
│   ├── profile.tsx   # User profile and settings
│   ├── wim-hof.tsx   # Browse preset routines
│   ├── custom.tsx    # Create custom routines
│   ├── session.tsx   # Breathing session interface
│   └── routine-details.tsx # Routine information
├── _layout.tsx       # Root navigation configuration
└── auth.tsx          # Authentication screens

components/           # Reusable UI components
data/                 # Static data and constants
docs/                 # Project documentation
hooks/                # Custom React hooks
types/                # TypeScript type definitions
utils/                # Utility functions
```

## 🎨 Design System

### Color Coding
- **Beginner**: Soft blue gradient (#3b82f6 → #60a5fa → #93c5fd)
- **Energy**: Vibrant orange gradient (#ea580c → #f97316 → #fb923c)
- **Calm**: Soothing purple gradient (#7c3aed → #8b5cf6 → #a78bfa)
- **Advanced**: Intense red gradient (#dc2626 → #ef4444 → #f87171)

### Animation Standards
- **Screen Transitions**: 300ms slide_from_right
- **Modal Presentations**: 400ms slide_from_bottom
- **Fade-in Effects**: 600ms opacity animations
- **Gesture Navigation**: Horizontal swipe-to-go-back

## 📚 Documentation

The project includes comprehensive documentation:

- **[Product Requirements Document](docs/PRD.md)**: Product vision, goals, and requirements
- **[Features Documentation](docs/features.md)**: Complete feature breakdown
- **[Workflow Overview](docs/workflow-overview.md)**: Development process and standards
- **[Cursor Rules](.cursorrules)**: Coding standards and best practices

## 🛠️ Development

### Code Standards
- **TypeScript**: Strict typing throughout the codebase
- **React Hooks**: Functional components with modern patterns
- **Expo Router**: File-based navigation system
- **AsyncStorage**: Local data persistence
- **Performance**: Native driver animations and optimized rendering

### Project Structure
- **Components**: Reusable UI components in `components/`
- **Hooks**: Custom React hooks in `hooks/`
- **Types**: TypeScript definitions in `types/`
- **Utils**: Utility functions in `utils/`
- **Data**: Static data and constants in `data/`

## 📊 Current Status

### ✅ Completed Features
- Home screen with Wim Hof breathing card
- Wim Hof screen with preset routines
- Custom routine creation and management
- Profile system with edit functionality
- Explore screen with search functionality
- Animation system with consistent transitions
- Smart navigation with context-aware routing
- Data persistence with AsyncStorage

### 🔄 In Progress
- Session screen breathing interface
- Progress tracking and analytics
- Settings and preferences

### 📋 Planned Features
- Image picker for profile pictures
- Audio guidance during sessions
- Advanced analytics and insights
- Community features and sharing

## 🤝 Contributing

1. Follow the [Cursor Rules](.cursorrules) for coding standards
2. Create RFCs for new features using the [RFC Template](docs/RFC-template.md)
3. Update documentation for any changes
4. Ensure TypeScript compilation passes
5. Test on both iOS and Android

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Wim Hof**: For developing the breathing method
- **Expo**: For the excellent React Native development platform
- **React Native**: For the mobile development framework
- **Lucide React Native**: For the beautiful icon set

---

**Built with ❤️ for the Wim Hof community** 
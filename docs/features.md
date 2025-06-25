# Features Documentation
## Meditation & Breathing App

### Overview
This document provides a comprehensive breakdown of all features in the meditation app, organized by functionality and user experience.

---

## 🏠 Core Features

### 1. Home Screen (`app/(tabs)/index.tsx`)
**Purpose**: Main dashboard providing quick access to key features

#### Features:
- **Wim Hof Breathing Card**: Featured meditation type with gradient background
- **Quick Start Actions**: One-tap access to 5-minute breathing and custom routines
  - **5-Minute Quick Start**: Direct access to optimized 5-minute Wim Hof session with smart navigation
  - **Custom Routine**: Navigate to routine creation interface with smart navigation
- **3D Card Design**: Elevated cards with shadows for modern appearance
- **Fade-in Animations**: Smooth 600ms fade-in transitions
- **Responsive Layout**: Adaptive design for different screen sizes
- **Smart Navigation**: Back buttons adapt based on entry point
  - From Index → Returns to Home screen
  - From Wim Hof → Returns to Wim Hof screen

#### User Flow:
1. User opens app → Home screen fades in
2. View Wim Hof breathing card with 3D effects
3. Quick access to start 5-minute breathing session with smart navigation
4. Navigate to custom routine creation with smart navigation
5. All back navigation returns to original entry point

---

### 2. Breathing Sessions (`app/(tabs)/session.tsx`)
**Purpose**: Core breathing exercise interface with real-time guidance

#### Features:
- **Session Controls**: Play, pause, skip, restart functionality
- **Visual Timer**: Countdown display with phase indicators
- **Breathing Animation**: Animated circle showing inhale/exhale
- **Phase Indicators**: Clear visual cues for current breathing phase
- **Progress Bar**: Overall session completion indicator
- **Haptic Feedback**: Tactile responses for phase transitions
- **Session Stats**: Real-time breath count and hold times

#### Session Phases:
1. **Breathing Phase**: Guided inhale/exhale cycles
2. **Exhale Hold**: Breath retention after exhale
3. **Inhale Hold**: Breath retention after inhale
4. **Final Hold**: Extended retention (if configured)

#### User Flow:
1. Select routine → Session screen loads
2. Review routine details and start
3. Follow visual/audio guidance through phases
4. Complete session and view results

---

### 3. Wim Hof Method (`app/(tabs)/wim-hof.tsx`)
**Purpose**: Browse and select from preset and custom breathing routines

#### Features:
- **Preset Routines**: Curated breathing patterns for different skill levels
  - **5-Minute Quick Start**: Optimized for quick energy boost
  - **Beginner Flow**: Perfect for starting Wim Hof journey
  - **Morning Energizer**: Boost energy for the day ahead
  - **Evening Calm**: Relax and unwind with slower breathing
  - **Advanced Challenge**: For experienced practitioners
- **Custom Routines**: User-created breathing patterns
- **Routine Management**: Delete custom routines
- **3D Card Design**: Elevated cards with shadows and gradients
- **Fade-in Animations**: Smooth transitions for better UX

#### User Flow:
1. Navigate to Wim Hof screen → View all available routines
2. Select preset routine → View routine details
3. Start session or create custom routine
4. Manage existing custom routines

---

### 4. Custom Routine Creation (`app/(tabs)/custom.tsx`)
**Purpose**: Create and edit personalized breathing routines

#### Features:
- **Round Editor**: Visual interface for configuring breathing parameters
- **Parameter Controls**: Adjust breaths, speed, hold times with +/- buttons
- **Speed Selection**: Choose between Slow, Medium, Fast breathing speeds
- **Round Management**: Add, delete, duplicate rounds
- **Final Hold Toggle**: Option to make last round a maximum hold
- **Smart Navigation**: Back button adapts based on entry point
  - From Index → Returns to Home screen
  - From Wim Hof → Returns to Wim Hof screen
- **3D Card Design**: Elevated cards with shadows for modern appearance
- **Fade-in Animations**: Smooth 600ms fade-in transitions

#### User Flow:
1. Navigate to Custom screen from Index or Wim Hof
2. Configure routine name and breathing parameters
3. Add/edit rounds as needed
4. Save routine or start session immediately
5. Back navigation returns to original entry point

---

### 5. Routine Details (`app/(tabs)/routine-details.tsx`)
**Purpose**: View detailed information about breathing routines before starting

#### Features:
- **Routine Overview**: Complete breakdown of breathing patterns and timing
- **Round Details**: Individual round configuration with speed indicators
- **Statistics Display**: Total rounds, estimated duration, and breath counts
- **Action Buttons**: Start session, edit (custom routines), delete (custom routines)
- **Smart Navigation**: Back button adapts based on entry point
  - From Index → Returns to Home screen
  - From Explore → Returns to Explore screen
  - From Wim Hof → Returns to Wim Hof screen
- **3D Card Design**: Elevated cards with shadows for modern appearance
- **Color-coded Speed**: Visual indicators for breathing speeds

#### User Flow:
1. Navigate to Routine Details from Index, Explore, or Wim Hof
2. Review routine information and round breakdown
3. Start session or perform routine management actions
4. Back navigation returns to original entry point
5. Session completion returns to original entry point

---

### 6. Explore (`app/(tabs)/explore.tsx`)
**Purpose**: Discover and browse different breathing routines and techniques

#### Features:
- **Featured This Week**: Curated selection of popular routines
  - 5-Minute Quick Start (NEW)
  - Morning Energizer
  - Advanced Challenge (PRO)
- **Wim Hof Variations**: Different approaches to Wim Hof method
  - Beginner Flow
  - Evening Calm
- **Interactive Cards**: Clickable session cards with routine details
- **Smart Navigation**: All cards lead to routine-details with proper back navigation
- **Visual Indicators**: NEW badges, PRO badges, ratings, and durations
- **Consistent Gradients**: Same gradient colors as Wim Hof section for each routine type
- **Search Functionality**: Real-time search by title and instructor
- **3D Card Design**: Elevated cards with shadows and depth
- **Fade-in Animations**: Smooth 600ms fade-in transitions

#### Search Features:
- **Search Bar**: Toggle search input to find routines by name or instructor
- **Real-time Results**: Instant filtering as you type
- **Empty State**: Helpful message when no results are found

#### User Flow:
1. Navigate to Explore screen → View curated routine categories
2. Use search bar to find specific routines
3. Click on any session card → Routine Details screen opens
4. Review routine information and start session
5. Back navigation returns to Explore screen
6. Session completion returns to Explore screen

---

### 7. Profile (`app/(tabs)/profile.tsx`)
**Purpose**: User account management and personal statistics

#### Features:
- **Profile Picture**: Circular image with camera overlay
- **User Information**: First name, last name, and bio display
- **Edit Profile Button**: Gradient button with 3D effects
- **Progress Statistics**: Real-time session and time tracking
- **Settings Section**: App preferences and configuration
- **Fade-in Animations**: Smooth screen transitions
- **Data Persistence**: AsyncStorage for profile data

#### Profile Components:
- **Profile Header**: Picture, name, bio, edit button
- **Progress Stats**: Sessions, minutes, streak, achievements
- **Settings List**: Notifications, dark mode, sound, app settings

#### Statistics Display:
- **Total Sessions**: Lifetime session count
- **Minutes**: Cumulative meditation time
- **Day Streak**: Consecutive days of practice
- **Achievements**: Unlocked milestones

---

### 8. Edit Profile (`app/(tabs)/edit-profile.tsx`)
**Purpose**: Edit user profile information and settings

#### Features:
- **Profile Picture Management**: Upload and change profile images
- **Name Editing**: Update first and last name fields
- **Bio Section**: Add personal description and meditation goals
- **Form Validation**: Ensures required fields are completed
- **Data Persistence**: Saves profile data to AsyncStorage
- **Consistent Navigation**: Back button always returns to Profile tab
- **3D Card Design**: Elevated input fields with shadows
- **Fade-in Animations**: Smooth 600ms fade-in transitions

#### User Flow:
1. Navigate to Edit Profile from Profile tab
2. Update profile information (name, bio, picture)
3. Save changes with validation
4. Success alert → Returns to Profile tab
5. Back button → Returns to Profile tab

---

## 🔧 Technical Features

### 9. Breathing Timer (`utils/breathingTimer.ts`)
**Purpose**: Core timing engine for breathing sessions

#### Features:
- **Precise Timing**: Accurate countdown implementation
- **Phase Management**: Automatic phase transitions
- **State Persistence**: Maintain session state across interruptions
- **Background Support**: Continue timing when app is backgrounded
- **Error Handling**: Graceful handling of timing issues

#### Timer States:
- **Running**: Active session with countdown
- **Paused**: Temporarily stopped session
- **Completed**: Finished session
- **Error**: Timer malfunction state

---

### 10. Breathing Animation (`components/BreathingAnimation.tsx`)
**Purpose**: Visual breathing guidance component

#### Features:
- **Animated Circle**: Expand/contract with breathing
- **Phase Indicators**: Visual cues for current phase
- **Smooth Transitions**: Fluid animation between states
- **Customizable**: Configurable animation parameters
- **Performance Optimized**: Efficient rendering

#### Animation States:
- **Inhale**: Circle expands outward
- **Exhale**: Circle contracts inward
- **Hold**: Circle maintains size
- **Transition**: Smooth phase changes

---

### 11. Data Management (`utils/storage.ts`)
**Purpose**: Local data persistence and management

#### Features:
- **Session Storage**: Save completed sessions
- **Routine Management**: Store custom routines
- **Profile Data**: User profile information
- **Progress Tracking**: Maintain user statistics
- **Data Export**: Backup and export functionality

#### Data Types:
- **Sessions**: Completed breathing sessions
- **Routines**: Custom breathing routines
- **User Profile**: Profile information and preferences
- **Statistics**: User progress metrics
- **Preferences**: App configuration

---

## 🎨 UI/UX Features

### 12. Animation System
**Purpose**: Smooth and engaging user experience

#### Features:
- **Screen Transitions**: Slide from right (300ms) for navigation
- **Fade-in Effects**: 600ms fade-in for all main screens
- **Native Driver**: Hardware-accelerated animations
- **Consistent Timing**: Uniform animation durations
- **Gesture Support**: Swipe navigation where appropriate

#### Animation Patterns:
- **useRef + Animated.Value**: For screen animations
- **useEffect + Animated.timing**: For lifecycle management
- **useNativeDriver: true**: For optimal performance
- **Opacity animations**: For smooth transitions

---

### 13. 3D Design System
**Purpose**: Modern, depth-rich visual experience

#### Features:
- **Elevation System**: Consistent shadow depths (elevation: 20)
- **Shadow Properties**: Black shadows with 15px offset
- **Wrapper Containers**: Proper shadow visibility on gradients
- **Border Effects**: Subtle borders for definition
- **Background Colors**: Light backgrounds for shadow contrast

#### 3D Standards:
- **Cards**: elevation: 20, shadowOpacity: 0.4, shadowRadius: 20
- **Buttons**: elevation: 8-12, shadowOpacity: 0.2, shadowRadius: 8
- **Inputs**: elevation: 4, shadowOpacity: 0.1, shadowRadius: 4
- **Wrappers**: backgroundColor: '#f8fafc' for shadow visibility

---

### 14. Color Coding System
**Purpose**: Intuitive routine identification and categorization

#### Routine Color Mapping:
- **Beginner Flow**: Soft blue (#3b82f6 → #60a5fa → #93c5fd)
- **Morning Energizer**: Vibrant orange (#ea580c → #f97316 → #fb923c)
- **Evening Calm**: Soothing purple (#7c3aed → #8b5cf6 → #a78bfa)
- **Advanced Challenge**: Intense red (#dc2626 → #ef4444 → #f87171)
- **Custom Routines**: Default blue (#1e3a8a → #1e40af → #3b82f6)

#### Implementation:
- **getRoutineGradient()**: Function for consistent color mapping
- **White Text**: High contrast text on all gradients
- **Semi-transparent Text**: Secondary text with rgba(255,255,255,0.9)

---

### 15. Navigation System
**Purpose**: Seamless app navigation and user flow

#### Features:
- **Tab Navigation**: Bottom tab bar for main sections
- **Stack Navigation**: Screen-to-screen navigation with animations
- **Deep Linking**: Direct access to specific content
- **Back Navigation**: Intuitive back button behavior
- **Loading States**: Smooth transition animations

---

### 16. Visual Design System
**Purpose**: Consistent and appealing visual experience

#### Features:
- **White Background Theme**: Clean, modern base design
- **Typography**: Readable, accessible font choices
- **Spacing**: Consistent layout and spacing
- **Icons**: Clear, meaningful iconography
- **Animations**: Smooth, purposeful motion

#### Design Principles:
- **Minimalism**: Clean, uncluttered interfaces
- **Accessibility**: High contrast, readable text
- **Calmness**: Soothing color palette
- **Clarity**: Clear visual hierarchy
- **Consistency**: Uniform design language

---

## 📊 Data Persistence Features

### 17. Profile Management
**Purpose**: Complete user profile system with data persistence

#### Features:
- **AsyncStorage Integration**: Local data persistence
- **Real-time Synchronization**: useFocusEffect for data updates
- **Form Validation**: Required field validation
- **Error Handling**: Graceful error management
- **Data Consistency**: Cross-screen data synchronization

#### Data Flow:
1. **Edit Profile**: Form input and validation
2. **Save to Storage**: AsyncStorage.setItem()
3. **Screen Focus**: useFocusEffect triggers reload
4. **Display Update**: Profile screen shows new data

#### Profile Data Structure:
```typescript
interface UserProfile {
  firstName: string;
  lastName: string;
  bio: string;
  profilePicture?: string;
}
```

---

## 🔒 Security & Privacy Features

### 18. Data Protection
**Purpose**: Secure user data and privacy

#### Features:
- **Local Storage**: Data stored on device
- **Input Validation**: Sanitized user inputs
- **Error Boundaries**: Graceful error handling
- **Data Export**: User-controlled data sharing
- **Privacy Controls**: User data management

---

## 🔄 Future Features (Roadmap)

### Phase 2 Features
- **Image Picker**: Profile picture upload functionality
- **Audio Guidance**: Voice instructions during sessions
- **Background Sounds**: Ambient meditation music
- **Social Features**: Community and sharing
- **Advanced Analytics**: Detailed performance insights

### Phase 3 Features
- **AI Recommendations**: Personalized routine suggestions
- **Video Tutorials**: Technique instruction videos
- **Premium Content**: Expert-led sessions
- **Wearable Integration**: Smartwatch compatibility
- **Research Platform**: Scientific data collection

---

## 🎬 Animation & Transition Standards

### Screen Transitions
- **Stack Navigation**: `slide_from_right` animation for all stack navigation (300ms duration)
- **Modal Presentations**: `slide_from_bottom` animation for auth screens (400ms duration)
- **Tab Navigation**: Smooth transitions between tabs with consistent timing
- **Error Screens**: `fade` animation for not-found screens (200ms duration)
- **Gesture Navigation**: Enabled for horizontal swipe-to-go-back functionality
- **Consistent Timing**: All animations follow established duration standards

### Animation Implementation
- **Root Layout**: Centralized animation configuration in `app/_layout.tsx`
- **Route-Specific**: Custom animations for different screen types (auth, tabs, errors)
- **Gesture Support**: Horizontal gesture navigation enabled across all routes
- **Platform Consistency**: Animations work seamlessly on both iOS and Android
- **Performance Optimized**: Uses native driver for smooth 60fps animations

### Animation Types by Route
- **Main App Routes**: `slide_from_right` (300ms) - Home, Wim Hof, Custom, Session, etc.
- **Authentication**: `slide_from_bottom` (400ms) - Login, Signup, Auth screens
- **Error Handling**: `fade` (200ms) - Not-found and error screens
- **Tab Switching**: Smooth transitions with consistent timing
- **Modal Presentations**: Bottom-up animations for modal-style screens

---

**Document Version:** 2.0  
**Last Updated:** December 2024  
**Next Review:** February 2025  
**Maintained By:** Development Team 
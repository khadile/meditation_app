# 🧘‍♀️ **Breathing App**

A React Native meditation and breathing app built with Expo Router and Clerk authentication.

## 🎯 Overview

This app provides a complete platform for practicing the Wim Hof breathing technique with:
- **Preset Routines**: Curated breathing patterns for different skill levels
- **Custom Routines**: User-created breathing sequences
- **Real-time Guidance**: Visual breathing animations and phase indicators
- **Progress Tracking**: Complete session recording and statistics
- **Modern UI**: 3D effects, gradients, and smooth animations
- **Authentication**: Secure user management with Clerk

## ✨ Features

### Core Functionality
- **Wim Hof Breathing Sessions**: Guided breathing with visual feedback
- **Custom Routine Creation**: Build personalized breathing patterns
- **Routine Management**: Save, edit, and delete custom routines
- **Profile System**: Complete user profiles with progress tracking
- **Session Recording**: Automatic session tracking and statistics
- **Real-time Statistics**: Live session count, meditation time, and streaks
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

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js (v18 or higher)
- Expo CLI
- iOS Simulator or Android Emulator

### **Installation**
```bash
npm install
```

### **Running the App**
```bash
npm start
```

## 🔐 **Authentication Setup**

### **Clerk Configuration**
This app uses Clerk for authentication. To set up Clerk:

1. **Create a Clerk Account**
   - Go to [clerk.com](https://clerk.com) and create an account
   - Create a new application

2. **Get Your Publishable Key**
   - In your Clerk dashboard, go to API Keys
   - Copy your publishable key (starts with `pk_test_` or `pk_live_`)

3. **Configure Environment Variables**
   - Create a `.env` file in the root directory
   - Add your Clerk publishable key:
   ```
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   ```

4. **Configure Clerk Settings**
   - Go to **User & Authentication** → **Email, Phone, Username**
   - Enable **Email address** and **Password**
   - Set **Phone number** to optional or disable it
   - Configure **Email verification** as needed for your use case

### **Authentication Features**
- ✅ Email/password signup and login
- ✅ Profile management with first name, last name, and bio
- ✅ Profile picture upload
- ✅ Secure token storage
- ✅ Email verification
- ✅ Password validation
- ✅ MVP-ready error handling

## 🫁 **App Features**

### **Breathing Exercises**
- **Wim Hof Method**: Guided breathing sessions with skip functionality
- **Preset Routines**: Beginner, Energy, Calm, and Advanced routines
- **Custom Routines**: Create and save your own breathing patterns
- **Session Interface**: Complete breathing session with visual guidance

### **Progress Tracking**
- **Session Recording**: Automatic recording when sessions are completed
- **Real-time Statistics**: Live session count, meditation time, and streaks
- **Profile Integration**: Statistics displayed on user profile screen
- **Streak Calculation**: Intelligent consecutive day streak tracking
- **Session History**: Complete session history with routine details

### **User Experience**
- **Beautiful UI**: Modern design with gradients and animations
- **Smooth Navigation**: Expo Router with custom animations
- **Offline Support**: Works without internet connection
- **Cross-Platform**: iOS and Android support
- **3D Effects**: Consistent elevation and shadow system

## 🛠️ **Development**

### **Project Structure**
```
app/                    # Expo Router screens
├── (tabs)/            # Tab navigation screens
├── auth.tsx           # Main auth screen
├── login.tsx          # Login screen
├── signup.tsx         # Signup screen
└── _layout.tsx        # Root layout

components/            # Reusable components
data/                  # App data and constants
hooks/                 # Custom React hooks
types/                 # TypeScript type definitions
utils/                 # Utility functions
```

### **Key Technologies**
- **React Native** with Expo
- **Expo Router** for navigation
- **Clerk** for authentication
- **TypeScript** for type safety
- **Lucide React Native** for icons
- **Expo Linear Gradient** for UI effects

## 🐛 **Troubleshooting**

### **Signup Failed Error**
If you're getting a "Signup Failed" error:

1. **Check Clerk Configuration**
   - Ensure your `.env` file has the correct Clerk publishable key
   - Verify the key is valid in your Clerk dashboard

2. **Email Verification**
   - Check your email for verification link
   - Or disable email verification in Clerk dashboard for development

3. **Phone Number Requirements**
   - Make sure phone number is set to optional in Clerk settings
   - Or add phone number field to the signup form

### **Common Issues**
- **Missing Environment Variables**: Create a `.env` file with your Clerk key
- **Network Issues**: Ensure you have internet connection for Clerk authentication
- **Invalid Email**: Use a valid email format
- **Weak Password**: Password must be 8+ characters with uppercase, lowercase, and number

## 📱 **Testing**

### **Authentication Flow**
1. Open the app
2. Navigate to signup
3. Fill in all required fields
4. Submit the form
5. Check email for verification (if enabled)

### **Development Testing**
- All breathing exercises work without authentication
- Profile management requires authentication
- Offline functionality available for core features

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

---

**Note**: This app is designed for educational and personal use. For production deployment, ensure proper security measures and environment configuration.

## 📚 Documentation

The project includes comprehensive documentation:

- **[Product Requirements Document](docs/PRD.md)**: Product vision, goals, and requirements
- **[Features Documentation](docs/features.md)**: Complete feature breakdown
- **[Workflow Overview](docs/workflow-overview.md)**: Development process and standards
- **[Cursor Rules](.cursorrules)**: Coding standards and best practices

## 🎨 Design System

### **Color Coding System**
- **Beginner routines**: Soft blue gradient (#3b82f6 → #60a5fa → #93c5fd)
- **Energy routines**: Vibrant orange gradient (#ea580c → #f97316 → #fb923c)
- **Calm routines**: Soothing purple gradient (#7c3aed → #8b5cf6 → #a78bfa)
- **Advanced routines**: Intense red gradient (#dc2626 → #ef4444 → #f87171)
- **Custom routines**: Default blue gradient (#1e3a8a → #1e40af → #3b82f6)

### **Animation Standards**
- **Screen Transitions**: 300ms slide_from_right for main navigation
- **Modal Presentations**: 400ms slide_from_bottom for auth screens
- **Fade Effects**: 600ms opacity animations for content loading
- **Gesture Navigation**: Horizontal swipe-to-go-back functionality
- **Performance Optimized**: Native driver for 60fps animations

## 🙏 Acknowledgments

- **Expo Team** for the amazing development platform
- **Clerk Team** for secure authentication solutions
- **React Native Community** for continuous improvements
- **Open Source Contributors** for valuable libraries and tools

---

**Status**: ✅ MVP with Clerk Authentication
**Last Updated**: December 2024
**Version**: 3.0 
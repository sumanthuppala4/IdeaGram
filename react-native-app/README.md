# IdeaGram React Native App

A React Native mobile application for IdeaGram - a habit tracking and challenge platform.

## Features

- 📱 Cross-platform mobile app (iOS & Android)
- 👤 User authentication (Login & Signup)
- 🎯 Habit tracking with progress monitoring
- 🏆 Challenge system with rewards
- 📊 Real-time leaderboard
- 🔔 Real-time notifications via WebSocket
- 💾 Redux state management
- 🎨 Responsive UI design

## Project Structure

```
src/
├── screens/              # Screen components
│   ├── LoginScreen.js
│   ├── SignupScreen.js
│   ├── DashboardScreen.js
│   ├── CreateHabitScreen.js
│   └── CreateChallengeScreen.js
├── components/           # Reusable components
│   ├── UI.js            # Basic UI components (Button, Input, Card, Badge)
│   ├── HabitTracker.js
│   ├── Challenges.js
│   ├── Leaderboard.js
│   ├── SocketProvider.js
│   └── NotificationToast.js
├── navigation/          # Navigation configuration
│   └── Navigation.js
├── store/               # Redux store
│   ├── index.js
│   ├── authSlice.js
│   ├── habitsSlice.js
│   ├── challengesSlice.js
│   └── leaderboardSlice.js
├── utils/               # Utility functions
│   ├── api.js          # API endpoints
│   └── validation.js
└── styles/              # Design tokens
    └── theme.js
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- React Native CLI
- Android Studio / Xcode (for emulators)

### Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update API and Socket URLs in `.env`:
```
API_URL=http://localhost:3000
SOCKET_URL=http://localhost:3000
```

## Running the App

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

### Start Metro Server
```bash
npm start
```

## Architecture

### Authentication
- JWT-based authentication
- Token stored in AsyncStorage
- Redux state management for auth

### Real-time Updates
- Socket.io integration for real-time data
- WebSocket listeners for habits, challenges, and leaderboard updates

### State Management
- Redux Toolkit for predictable state management
- Separate slices for auth, habits, challenges, and leaderboard

## API Integration

The app connects to the NestJS backend at:
- Base URL: `http://localhost:3000` (configurable)
- Endpoints: `/auth`, `/habits`, `/challenges`, `/leaderboard`

## Theme & Styling

Consistent design system with:
- **Colors**: Primary (indigo), Secondary (purple), Success, Error, Warning
- **Spacing**: Standardized scale (xs, sm, md, lg, xl, xxl)
- **Typography**: Hierarchical font sizes and weights
- **Components**: Reusable UI building blocks

## Build & Deployment

### Android Release Build
```bash
cd android
./gradlew assembleRelease
```

### iOS Release Build
```bash
cd ios
xcodebuild -configuration Release
```

## Development

### Adding New Screens
1. Create screen file in `src/screens/`
2. Add to navigation stack in `src/navigation/Navigation.js`
3. Import and use navigation props

### Adding New Components
1. Create component in `src/components/`
2. Use theme tokens from `src/styles/theme.js`
3. Export from component index if needed

### Adding Redux State
1. Create slice in `src/store/`
2. Import and add to store configuration in `src/store/index.js`

## Troubleshooting

### Metro Bundle Issues
```bash
npm start -- --reset-cache
```

### Dependency Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### Android Emulator
Make sure Android Studio is properly configured and emulator is running.

## License

MIT License - See LICENSE file for details

## Support

For issues or questions, please open an issue in the main IdeaGram repository.

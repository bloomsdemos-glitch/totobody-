# TOTOBODY Fitness App

## Overview
TOTOBODY is a mobile-first Ukrainian fitness application featuring advanced neumorphic design with glassmorphism elements. The app provides comprehensive workout management including HIIT, Mixed, and bodyweight training programs, along with weight tracking, progress monitoring, and dance timer functionality. The interface emphasizes soft, button-like tiles with rounded corners (✴️ shape) and mature glass effects for menus and modals.

## User Preferences
Preferred communication style: Simple, everyday language.
Design preference: Soft, rounded neumorphic tiles (✴️ shape), glassmorphism for menus, Inter font family throughout.

## Recent Changes (August 16, 2025)
- Enhanced neumorphic design with softer shadows and larger, more button-like tiles
- Added glassmorphism side menu with workout settings, statistics, goals, and app settings
- Implemented glassmorphism modals for DANCE timer, weight tracking, and rest day logging
- Increased exercise name font size for better readability during workouts
- Added dynamic progress bar with color-coding (red/orange/yellow/green) based on goal proximity
- Integrated local storage for weight tracking and rest day management
- Updated workout program mapping for ГАНТЕЛЬ and ФІЗИЧНЕ programs

## System Architecture

### Frontend Architecture
- **Pure Client-Side Application**: Built with vanilla HTML, CSS, and JavaScript for maximum simplicity and performance
- **Single Page Application (SPA)**: Uses screen-based navigation system with JavaScript to show/hide different views
- **Mobile-First Design**: Responsive layout optimized for mobile devices with touch-friendly interactions
- **Neumorphic UI Design**: Modern design aesthetic using CSS custom properties for consistent theming

### Design System
- **CSS Custom Properties**: Centralized color scheme, shadows, and spacing using CSS variables
- **Component-Based Styling**: Reusable neumorphic tiles and UI components
- **Accessibility Features**: Disabled tap highlights and user-scalable viewport for consistent mobile experience

### Workout Logic
- **Exercise Pools**: Three predefined exercise categories (HIIT, Mixed, Common) stored as JavaScript arrays
- **Dynamic Workout Generation**: Randomized exercise selection using shuffle algorithms
- **Timer-Based Sessions**: Built-in exercise timing and session management
- **Progress Tracking**: Real-time exercise completion tracking during workouts

### Navigation System
- **Screen-Based Routing**: JavaScript-powered navigation between home, training, and other screens
- **State Management**: Simple DOM manipulation for managing active screens and UI states
- **Event-Driven Interactions**: Click handlers for workout tiles and navigation controls

### Development Server
- **Python HTTP Server**: Simple static file server using Python's built-in http.server module
- **CORS Support**: Development-friendly CORS headers for local testing
- **Port Configuration**: Runs on port 5000 with host binding for network access

## External Dependencies

### Fonts and Typography
- **Google Fonts**: Inter font family (weights: 400, 600, 700) loaded via CDN
- **Font Optimization**: Preconnect headers for improved loading performance

### Development Tools
- **Python 3**: Required for running the development server
- **Modern Browser**: HTML5 and ES6+ JavaScript features used throughout

### No Database Required
- **Client-Side Storage**: All workout data and exercise pools are stored in JavaScript arrays
- **No Backend Persistence**: Stateless application with no data persistence requirements
- **No Authentication**: Open access fitness app with no user accounts or login system
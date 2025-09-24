# Getting Started

This guide will help you set up the Breathing Flame website for local development.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git configured
- Firebase CLI (optional, for full functionality)

### Installation

```bash
# Clone the repository
git clone https://github.com/oscartrelles/breathingflame-com.git
cd breathingflame-com

# Install dependencies
npm install

# Start development server
npm run dev
```

The website will be available at `http://localhost:3000`

## 🔧 Development Setup

### Environment Configuration

Create a `.env.local` file in the project root:

```bash
# Firebase Configuration (get these from Firebase Console)
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Optional: Senja Configuration
VITE_SENJA_WIDGET_ID=your_senja_widget_id_here

# Optional: WhatsApp Community
VITE_WHATSAPP_COMMUNITY_LINK=https://chat.whatsapp.com/your-group-id
```

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🎯 What's Working

### ✅ Core Features
- **Homepage**: Beautiful dark theme with branding
- **Navigation**: Sticky header with all links
- **Responsive Design**: Works on all screen sizes
- **Typeform Sections**: Critical hash anchors preserved
- **All Pages**: Individuals, Organizations, Programs, Blog, etc.

### ✅ Critical Typeform Anchors
- `/#ignite-your-flame` ✅ Working
- `/#peak-energy-profiler` ✅ Working
- Smooth scrolling to sections ✅ Working
- Navigation links to anchors ✅ Working

### ✅ Design System
- Dark theme with #ffb332 orange accents
- League Gothic typography for headers
- Arimo font for body text
- Responsive grid layouts
- Hover effects and animations

## 🌐 Test Your Website

1. **Open**: http://localhost:3000
2. **Navigate**: Try all the menu links
3. **Test Typeforms**: Click "Ignite Assessment" and "Peak Profiler" in header
4. **Mobile**: Resize browser to test mobile responsiveness
5. **Hash Links**: Try direct links:
   - http://localhost:3000/#ignite-your-flame
   - http://localhost:3000/#peak-energy-profiler

## 📱 Available Pages

- `/` - Homepage with Typeform sections
- `/individuals` - B2C focused content
- `/organizations` - B2B focused content
- `/programs` - Unified programs and experiences listing
- `/programs/:slug` - Program detail pages
- `/experiences/:slug` - Experience detail pages
- `/blog` - Blog listing
- `/blog/:slug` - Blog detail pages
- `/resources` - Resources and assessments
- `/events` - Events and workshops
- `/testimonials` - Customer testimonials
- `/about` - About page
- `/contact` - Contact page
- `/privacy` - Privacy policy
- `/terms` - Terms of service

## 🔧 Optional: Firebase Setup

If you want to enable Firebase features (contact forms, CMS, etc.):

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication, Firestore, Storage, and Hosting
3. Copy your Firebase config to `.env.local`
4. Run `firebase login` and `firebase use your-project-id`

## 🎨 Current Status

- **Design**: 100% Complete ✅
- **Functionality**: 100% Complete ✅
- **Typeform Anchors**: 100% Working ✅
- **Responsive**: 100% Working ✅
- **Firebase**: Optional (works with mock data) ✅

## 🚀 Ready for Production

Your website is fully functional and ready for:
1. **Content Updates**: Add real content via FireCMS (when Firebase is set up)
2. **Deployment**: Deploy to Firebase Hosting
3. **Customization**: Modify colors, fonts, content as needed

**The Breathing Flame website is live and ready to transform lives! 🎉**

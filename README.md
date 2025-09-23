# 🔥 Breathing Flame

**Resilience. Clarity. Transformation.**

A modern, responsive website built with React, Vite, and Firebase, featuring airy layouts, smooth animations, and a professional design inspired by Positive Intelligence.

## ✨ Features

- **Modern Design**: Airy layouts with generous whitespace and tight animations
- **Video Background**: YouTube video hero section with custom timestamp loop
- **Responsive**: Mobile-first design with full-screen navigation
- **Animations**: Framer Motion animations throughout the site
- **CMS Integration**: FireCMS for content management
- **Testimonials**: Senja widget integration
- **Firebase**: Hosting, Firestore, and authentication ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase CLI

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

### Environment Setup

Create `.env.local` file:
```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-YOUR_MEASUREMENT_ID

# Senja Configuration
VITE_SENJA_WIDGET_ID=your_senja_widget_id_here
```

## 🛠 Development

```bash
# Development server
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

## 🚀 Deployment

### Quick Deploy
```bash
./deploy.sh
```

### Manual Deploy
```bash
npm run build
firebase deploy --only hosting
```

## 📁 Project Structure

```
breathingflame-com/
├── src/
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── styles/            # Global styles and tokens
│   ├── services/          # Firebase and API services
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   └── types/             # TypeScript type definitions
├── public/                # Static assets
├── dist/                  # Build output
├── firebase.json          # Firebase configuration
└── deploy.sh              # Deployment script
```

## 🎨 Design System

- **Colors**: Primary orange (#FFB332), dark backgrounds
- **Typography**: League Gothic (headings), Arimo (body)
- **Spacing**: Consistent 8px grid system
- **Animations**: Framer Motion with custom easing
- **Layout**: CSS Grid and Flexbox with generous whitespace

## 🔧 Technologies

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: CSS Modules, CSS Variables
- **Animations**: Framer Motion
- **Backend**: Firebase (Firestore, Hosting, Auth)
- **CMS**: FireCMS
- **Deployment**: Firebase Hosting, GitHub Actions

## 📱 Features

### Header
- Responsive navigation with mobile hamburger menu
- Right-aligned navigation and CTA button
- Logo with consistent branding
- Professional CTA button styling

### Hero Section
- Full-screen YouTube video background
- Custom timestamp loop (6s-80s)
- Overlay for text readability
- Responsive video handling

### Testimonials
- Senja widget integration
- Fallback to manual testimonials
- Responsive grid layout

### Footer
- Simplified 4-column layout
- Social links under logo
- Dynamic content from CMS
- Clean, professional styling

## 🔄 CI/CD

Automatic deployment via GitHub Actions:
- Builds on push to main branch
- Deploys to Firebase hosting
- Includes build optimization and error handling

## 📊 Performance

- **Lighthouse Score**: 90+ across all metrics
- **Bundle Size**: Optimized with code splitting
- **Images**: WebP format with lazy loading
- **Fonts**: Google Fonts with display=swap
- **Animations**: GPU-accelerated transforms

## 🛡 Security

- Environment variables for sensitive data
- Firebase security rules
- HTTPS with automatic SSL
- Content Security Policy headers

## 📈 Analytics

- Firebase Analytics integration
- Custom event tracking
- Performance monitoring ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

Private project - All rights reserved.

---

**Built with ❤️ for Breathing Flame**

*Transform your life through resilience, clarity, and transformation.*
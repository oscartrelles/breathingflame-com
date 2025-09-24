# 🔥 Breathing Flame

**Resilience. Clarity. Transformation.**

A modern, responsive website built with React, Vite, and Firebase, featuring airy layouts, smooth animations, and a professional design inspired by Positive Intelligence.

## ✨ Features

- **Modern Design**: Airy layouts with generous whitespace and smooth animations
- **CMS Integration**: FireCMS for content management
- **Blog System**: Complete blog with listing, detail pages, and components
- **Dynamic Sitemap**: Auto-generated from Firestore content
- **SEO Optimized**: Comprehensive meta tags and structured data
- **Responsive**: Mobile-first design with full-screen navigation
- **Firebase**: Hosting, Firestore, Functions, and authentication ready

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
├── docs/                  # Comprehensive documentation
├── public/                # Static assets
├── dist/                  # Build output
├── firebase.json          # Firebase configuration
└── deploy.sh              # Deployment script
```

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[Getting Started](docs/getting-started.md)** - Development setup and first steps
- **[Architecture](docs/architecture.md)** - Technical architecture and design decisions
- **[Deployment](docs/deployment.md)** - Production deployment guide
- **[Changelog](docs/changelog.md)** - Project history and updates

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
- **Backend**: Firebase (Firestore, Hosting, Auth, Functions)
- **CMS**: FireCMS
- **Deployment**: Firebase Hosting, GitHub Actions

## 📱 Key Features

### CMS-Driven Content
- Homepage, Individuals, Organizations, and Programs pages fully editable
- Blog system with author management and tagging
- Dynamic sitemap generation from Firestore content

### SEO & Performance
- Dynamic sitemap.xml generation
- Comprehensive meta tags and JSON-LD structured data
- Optimized bundle sizes and loading performance
- Core Web Vitals optimization

### Integration Features
- Typeform and Koalendar embeds
- Legacy URL redirects for hash-based navigation
- Scroll-to-top behavior on route changes
- Comprehensive legal pages

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
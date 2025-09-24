# Breathing Flame - Deployment Guide

This guide covers the complete deployment process for the Breathing Flame website to Firebase.

## 🚀 Prerequisites

### Required Tools
- Node.js 18+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Git configured
- Firebase project created

### Firebase Project Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "breathing-flame" (or your preferred name)
3. Enable the following services:
   - **Authentication** (for FireCMS)
   - **Firestore Database** (for content)
   - **Storage** (for media files)
   - **Hosting** (for website)
   - **Functions** (for contact forms)

## 🔧 Initial Setup

### 1. Firebase CLI Setup
```bash
# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select the following services:
# - Hosting
# - Firestore
# - Storage
# - Functions
# - Emulators (optional, for development)

# Use existing firebase.json (already configured)
# Use existing firestore.rules (already configured)
# Use existing storage.rules (already configured)
# Use existing functions directory (already configured)
```

### 2. Environment Configuration
```bash
# Copy environment template
cp env.sample .env

# Edit .env with your Firebase project details
nano .env
```

Required environment variables:
```env
# Firebase Configuration (from Firebase Console > Project Settings)
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Typeform URLs (your actual Typeform URLs)
VITE_TYPEFORM_IGNITE_URL=https://your_typeform.typeform.com/to/ignite
VITE_TYPEFORM_PEAK_URL=https://your_typeform.typeform.com/to/peak

# Analytics IDs
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_LINKEDIN_INSIGHT_TAG=your_linkedin_tag
VITE_META_PIXEL_ID=your_meta_pixel_id

# Contact Configuration
VITE_CONTACT_EMAIL=contact@breathingflame.com
VITE_CONTACT_PHONE=+1234567890
```

### 3. Firebase Functions Configuration
```bash
# Set up email configuration for contact forms
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.password="your-app-password"
firebase functions:config:set email.recipient="contact@breathingflame.com"
```

## 📦 Build & Deploy

### 1. Install Dependencies
```bash
# Install project dependencies
npm install

# Install functions dependencies
cd functions
npm install
cd ..
```

### 2. Build the Application
```bash
# Build for production
npm run build

# Verify build output
ls -la dist/
```

### 3. Deploy to Firebase
```bash
# Deploy everything
firebase deploy

# Or deploy specific services
firebase deploy --only hosting
firebase deploy --only firestore
firebase deploy --only storage
firebase deploy --only functions
```

### 4. Verify Deployment
1. Check Firebase Console for successful deployment
2. Visit your website URL
3. Test critical functionality:
   - Typeform anchors: `/#ignite-your-flame` and `/#peak-energy-profiler`
   - Contact forms
   - Navigation
   - Mobile responsiveness

## 🎯 Post-Deployment Setup

### 1. FireCMS Setup
1. Go to your Firebase project console
2. Navigate to Authentication
3. Enable Email/Password authentication
4. Create admin users with custom claims:
   ```javascript
   // In Firebase Console > Authentication > Users
   // Add custom claims: { role: 'admin' }
   ```

### 2. FireCMS Deployment
```bash
# Install FireCMS
npm install firecms

# Create FireCMS app (if not already done)
# Follow FireCMS documentation for deployment
```

### 3. Content Setup
1. Access FireCMS admin panel
2. Configure initial content:
   - Site settings
   - Navigation links
   - Homepage content
   - Typeform URLs
   - Contact information

### 4. Analytics Setup
1. Configure Google Analytics 4
2. Set up LinkedIn Insight Tag
3. Configure Meta Pixel
4. Verify tracking is working

## 🔄 Continuous Deployment

### GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '18'
    - run: npm install
    - run: npm run build
    - uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        channelId: live
        projectId: your-firebase-project-id
```

### Environment Variables for CI/CD
Set these in your CI/CD system:
- `FIREBASE_SERVICE_ACCOUNT` (JSON key file)
- All environment variables from `.env`

## 🛠 Maintenance

### Regular Tasks
1. **Content Updates**: Use FireCMS for ongoing content management
2. **Security Updates**: Keep dependencies updated
3. **Performance Monitoring**: Monitor Core Web Vitals
4. **Analytics Review**: Regular review of analytics data

### Monitoring
1. **Firebase Console**: Monitor usage, errors, performance
2. **Google Analytics**: Track user behavior and conversions
3. **Error Tracking**: Monitor for JavaScript errors
4. **Uptime Monitoring**: Ensure site availability

### Backup Strategy
1. **Firestore**: Automatic backups enabled by default
2. **Storage**: Regular exports of media files
3. **Code**: Git repository with regular commits
4. **Configuration**: Document all environment variables

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run build
```

#### Deployment Failures
```bash
# Check Firebase CLI version
firebase --version

# Update Firebase CLI
npm install -g firebase-tools

# Check project configuration
firebase projects:list
firebase use --add
```

#### Typeform Anchors Not Working
1. Verify `HashAnchorRouter` is mounted in App.tsx
2. Check that sections have correct IDs
3. Test hash navigation manually
4. Verify TypeformEmbed component is rendering

#### FireCMS Access Issues
1. Check Firebase Authentication setup
2. Verify custom claims are set correctly
3. Check Firestore security rules
4. Ensure user has proper role assigned

### Support Resources
- [Firebase Documentation](https://firebase.google.com/docs)
- [FireCMS Documentation](https://firecms.co/docs)
- [React Router Documentation](https://reactrouter.com/)
- [Vite Documentation](https://vitejs.dev/)

## 📊 Performance Optimization

### Build Optimization
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist/assets/*.js

# Optimize images
# Use WebP format where possible
# Implement lazy loading
```

### Runtime Optimization
1. Enable Firebase Hosting caching
2. Use CDN for static assets
3. Implement service worker for offline support
4. Monitor Core Web Vitals

## 🔒 Security Checklist

- [ ] Firebase security rules configured
- [ ] Environment variables secured
- [ ] HTTPS enforced
- [ ] Content Security Policy implemented
- [ ] Input validation on all forms
- [ ] Rate limiting on API endpoints
- [ ] Regular dependency updates

---

**Deployment completed successfully! 🎉**

Your Breathing Flame website is now live and ready to transform lives through resilience, clarity, and transformation.


# Deployment Guide

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
   - **Functions** (for contact forms and sitemap)

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
# - Functions
# - Storage
```

### 2. Environment Configuration
Create `.env.local` file with your Firebase configuration:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-YOUR_MEASUREMENT_ID

# Optional: Additional services
VITE_SENJA_WIDGET_ID=your_senja_widget_id_here
VITE_WHATSAPP_COMMUNITY_LINK=https://chat.whatsapp.com/your-group-id
```

### 3. Firestore Security Rules
The project includes pre-configured security rules in `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to all content
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.role in ['admin', 'editor'];
    }
  }
}
```

### 4. Storage Security Rules
Media upload rules are configured in `storage.rules`:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.role in ['admin', 'editor'];
    }
  }
}
```

## 🚀 Deployment Process

### Quick Deploy
Use the provided deployment script:

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment
./deploy.sh
```

### Manual Deploy

#### 1. Build the Project
```bash
# Install dependencies
npm install

# Build for production
npm run build
```

#### 2. Deploy to Firebase
```bash
# Deploy hosting only
firebase deploy --only hosting

# Deploy functions only
firebase deploy --only functions

# Deploy everything
firebase deploy
```

#### 3. Deploy Security Rules
```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage
```

## 🔧 Post-Deployment Setup

### 1. FireCMS Configuration
1. Go to your Firebase project console
2. Navigate to Authentication → Users
3. Add users with appropriate roles:
   - **Admin**: Full access
   - **Editor**: Content management
   - **Viewer**: Read-only access

### 2. Content Setup
1. Access FireCMS at `https://your-project-id.web.app/cms`
2. Configure initial content:
   - Site settings and navigation
   - Homepage content
   - Programs and experiences
   - Blog posts
   - Testimonials

### 3. Domain Configuration
1. Go to Firebase Hosting
2. Add your custom domain
3. Configure SSL certificate
4. Update DNS records

### 4. Analytics Setup
1. Configure Google Analytics 4
2. Set up conversion tracking
3. Configure LinkedIn Insight Tag
4. Set up Meta Pixel (if needed)

## 🔍 Verification

### 1. Test Core Features
- [ ] Homepage loads correctly
- [ ] Typeform anchors work (`/#ignite-your-flame`, `/#peak-energy-profiler`)
- [ ] All navigation links work
- [ ] Blog system functions
- [ ] Programs listing works
- [ ] Contact forms submit successfully
- [ ] Mobile responsiveness

### 2. Test SEO Features
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`
- [ ] Meta tags are properly set
- [ ] Structured data is valid

### 3. Test Performance
- [ ] Page load speeds are acceptable
- [ ] Images are optimized
- [ ] Bundle sizes are reasonable
- [ ] Core Web Vitals are good

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run type-check
```

#### Firebase Deploy Issues
```bash
# Check Firebase CLI version
firebase --version

# Update Firebase CLI
npm install -g firebase-tools@latest

# Check project configuration
firebase projects:list
firebase use --add
```

#### Environment Variables
- Ensure all required environment variables are set
- Check that Firebase project ID matches your configuration
- Verify API keys are correct

#### Firestore Rules
- Ensure security rules are deployed
- Check that users have appropriate roles
- Verify Firestore is enabled in Firebase console

## 📊 Monitoring

### 1. Firebase Console
- Monitor hosting usage
- Check function logs
- Review Firestore usage
- Monitor storage usage

### 2. Analytics
- Set up Google Analytics 4
- Monitor page views and user behavior
- Track conversion events
- Set up custom dashboards

### 3. Performance
- Use Lighthouse for performance audits
- Monitor Core Web Vitals
- Set up uptime monitoring
- Track error rates

## 🔄 CI/CD Setup

### GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm install
    - run: npm run build
    - uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        channelId: live
        projectId: your-project-id
```

## 📈 Performance Optimization

### 1. Bundle Optimization
- Code splitting is already configured
- Images are optimized
- Fonts use `display=swap`
- CSS is minified

### 2. Caching
- Firebase Hosting provides automatic caching
- Static assets are cached for 1 year
- HTML files are cached for 1 hour

### 3. CDN
- Firebase Hosting uses Google's CDN
- Global edge locations for fast loading
- Automatic HTTPS

## 🛡 Security

### 1. Firebase Security
- Security rules are configured
- Authentication is required for writes
- HTTPS is enforced

### 2. Content Security
- Environment variables for sensitive data
- No hardcoded secrets
- Proper input validation

### 3. Monitoring
- Firebase provides security monitoring
- Set up alerts for suspicious activity
- Regular security audits

## 📞 Support

For deployment issues:
1. Check Firebase console for errors
2. Review function logs
3. Check browser console for client-side errors
4. Verify environment configuration
5. Test locally before deploying

**Your Breathing Flame website is now live and ready to transform lives! 🚀**

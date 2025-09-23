# 🚀 Deployment Setup Guide

## ✅ **Remote Repository and Firebase Hosting Configuration**

Complete guide to set up remote repository and deploy to Firebase hosting.

## 📋 **Step 1: Create Remote Repository**

### **Option A: GitHub (Recommended)**
1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Repository name: `breathingflame-com`
4. Description: `Breathing Flame - Resilience, Clarity, Transformation`
5. Set to **Private** (recommended for business websites)
6. **Don't** initialize with README (we already have files)
7. Click "Create repository"

### **Option B: GitLab or Bitbucket**
Follow similar steps on your preferred Git hosting platform.

## 🔗 **Step 2: Connect Local Repository to Remote**

Run these commands in your project directory:

```bash
# Add the remote repository (replace with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/breathingflame-com.git

# Push your code to the remote repository
git push -u origin main
```

## 🔥 **Step 3: Firebase Hosting Setup**

### **Prerequisites**
- Node.js installed
- Firebase CLI installed: `npm install -g firebase-tools`

### **Firebase Configuration (Already Done)**
✅ **firebase.json** - Updated to host from `dist` directory
✅ **Firebase project** - Already configured in `.firebaserc`

### **Build and Deploy Commands**

```bash
# Install dependencies
npm install

# Build the project for production
npm run build

# Deploy to Firebase hosting
firebase deploy --only hosting
```

### **Automatic Deployment with GitHub Actions (Optional)**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build project
        run: npm run build
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: breathingflame-com
```

## 🛠 **Step 4: Environment Variables Setup**

### **For Local Development**
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

### **For Production (Firebase Functions)**
Set environment variables in Firebase:
```bash
firebase functions:config:set app.senja_widget_id="your_senja_widget_id"
```

## 📁 **Step 5: Project Structure for Deployment**

```
breathingflame-com/
├── dist/                    # Build output (Firebase hosting)
├── src/                     # Source code
├── public/                  # Static assets
├── firebase.json           # Firebase configuration
├── .firebaserc             # Firebase project settings
├── package.json            # Dependencies
└── vite.config.ts          # Vite configuration
```

## 🚀 **Step 6: Deployment Commands**

### **Quick Deploy**
```bash
npm run build && firebase deploy --only hosting
```

### **Full Deploy (including functions)**
```bash
npm run build && firebase deploy
```

### **Deploy with Preview**
```bash
firebase hosting:channel:deploy preview
```

## 🔧 **Step 7: Build Optimization**

### **Vite Configuration (Already Optimized)**
The project is configured with:
- ✅ **Code splitting** for better performance
- ✅ **Asset optimization** and compression
- ✅ **Modern browser targeting**
- ✅ **Bundle analysis** tools

### **Performance Checklist**
- ✅ **Images optimized** (WebP format, proper sizing)
- ✅ **CSS minified** and purged
- ✅ **JavaScript bundled** and minified
- ✅ **Fonts optimized** (Google Fonts with display=swap)
- ✅ **Lazy loading** for components

## 🌐 **Step 8: Domain Configuration (Optional)**

### **Custom Domain Setup**
1. In Firebase Console → Hosting → Add custom domain
2. Follow DNS configuration instructions
3. Update DNS records with your domain provider

### **SSL Certificate**
✅ **Automatic SSL** - Firebase provides free SSL certificates

## 📊 **Step 9: Monitoring and Analytics**

### **Firebase Analytics**
✅ **Already configured** in the project

### **Performance Monitoring**
```bash
# Install Firebase Performance
npm install firebase
```

### **Error Tracking**
Firebase Crashlytics can be added if needed.

## 🔄 **Step 10: Continuous Deployment Workflow**

### **Recommended Workflow**
1. **Development**: Work on feature branches
2. **Testing**: Test locally with `npm run dev`
3. **Build**: `npm run build` to test production build
4. **Deploy**: Push to `main` branch triggers deployment
5. **Monitor**: Check Firebase Console for deployment status

## 🎯 **Next Steps After Setup**

1. **Push to Remote**: `git push -u origin main`
2. **Build Project**: `npm run build`
3. **Deploy to Firebase**: `firebase deploy --only hosting`
4. **Set up Environment Variables** in Firebase Console
5. **Configure Custom Domain** (if needed)
6. **Set up GitHub Actions** for automatic deployment

## 🆘 **Troubleshooting**

### **Common Issues**
- **Build fails**: Check for TypeScript errors
- **Deploy fails**: Verify Firebase project configuration
- **Environment variables**: Ensure they're set in Firebase Console
- **Domain issues**: Check DNS configuration

### **Useful Commands**
```bash
# Check Firebase project
firebase projects:list

# View deployment logs
firebase hosting:channel:open live

# Test locally with Firebase emulators
firebase emulators:start
```

---

**Your Breathing Flame website is ready for deployment! 🎉**

*Follow the steps above to get your website live on Firebase hosting.*

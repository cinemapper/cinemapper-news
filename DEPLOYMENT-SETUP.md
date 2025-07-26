# Firebase Multi-Site Deployment Setup

## 🚨 CRITICAL: Prevent Overwriting Main Site

This guide ensures your news app deploys to a separate site without affecting your main CineMapper site.

## Step-by-Step Setup

### 1. Create News Site in Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: `cinemapper-44cff`
3. Navigate to **Hosting**
4. Click **"Add another site"**
5. Enter site ID: `cinemapper-news`
6. Note the generated URLs:
   - `cinemapper-news.web.app`
   - `cinemapper-news.firebaseapp.com`

### 2. Configure Hosting Targets (REQUIRED)
Run these commands from the `news-app` directory:

```bash
# Set up the news site target
firebase target:apply hosting news cinemapper-news

# Verify targets are set correctly
firebase target
```

### 3. Add Custom Domain (Optional)
1. In Firebase Console → Hosting → cinemapper-news site
2. Click **"Add custom domain"**
3. Enter: `news.cinemapper.com`
4. Follow DNS setup instructions

### 4. Deploy Safely
```bash
# Build the app
npm run build

# Deploy ONLY to news site (won't affect main site)
firebase deploy --only hosting:news

# Or use the batch file
deploy.bat
```

## ⚠️ Safety Checks

### Before First Deployment:
- [ ] Created separate site in Firebase Console
- [ ] Configured `firebase target:apply hosting news cinemapper-news`
- [ ] Verified `firebase.json` has `"target": "news"`
- [ ] Test with `firebase deploy --only hosting:news`

### Deploy Commands:
- ✅ **SAFE**: `firebase deploy --only hosting:news`
- ❌ **DANGEROUS**: `firebase deploy --only hosting` (would overwrite main site)
- ❌ **DANGEROUS**: `firebase deploy` (would deploy everything)

## Current Configuration Status:
- ✅ `firebase.json` has target: "news"
- ✅ `deploy.bat` uses `--only hosting:news`
- ✅ Safe deployment configured 
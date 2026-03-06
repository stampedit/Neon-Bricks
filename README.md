# STACKS - Viral Mobile Game

A highly addictive stacking game built with vanilla HTML5, CSS3, and JavaScript. Features social competition, viral sharing, and cosmetic monetization.

## 🚀 Quick Start

```bash
# Clone and run locally
git clone <repository>
cd stacks-game
python -m http.server 3000
```

Open http://localhost:3000 to play.

## 📱 Deployment Options

### 1. **GitHub Pages (Free & Recommended)**
Best for: Quick demo, portfolio, testing

```bash
# Deploy to GitHub Pages
git add .
git commit -m "Deploy STACKS game"
git push origin main

# Enable GitHub Pages in repo settings
# Source: Deploy from branch > main > / (root)
```

**Live URL:** `https://yourusername.github.io/stacks-game/`

---

### 2. **Vercel (Free)**
Best for: Custom domains, analytics, automatic deployments

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Features:**
- Custom domain support
- Built-in analytics
- HTTPS automatically
- Zero-config deployment

---

### 3. **Netlify (Free)**
Best for: Form handling, A/B testing, edge functions

```bash
# Drag-and-drop deploy
# 1. Build the project: No build step needed
# 2. Drag the entire folder to netlify.com
# 3. Get instant URL
```

**Features:**
- Instant rollbacks
- Split testing
- Form handling
- Edge functions

---

### 4. **Firebase Hosting (Free Tier)**
Best for: Google ecosystem integration

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize
firebase init hosting
firebase deploy
```

**Features:**
- Global CDN
- SSL certificates
- Custom domains
- Firebase integration

---

### 5. **Cloudflare Pages (Free)**
Best for: Performance, security, edge computing

```bash
# Connect Git repo or upload files
# Automatic deployment from Git
```

**Features:**
- Global CDN
- DDoS protection
- Edge functions
- Analytics

---

## 🎯 Production Optimization

### Mobile App Deployment

#### **Progressive Web App (PWA)**
```bash
# Add PWA features
# 1. Create manifest.json
# 2. Add service worker
# 3. Enable offline play
```

#### **Capacitor/Cordova (Native Apps)**
```bash
# Convert to mobile apps
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios
npx cap init STACKS com.stacks.game
npx cap add android
npx cap add ios
npx cap run android
```

#### **React Native Conversion**
For full native performance and App Store deployment.

---

## 📊 Analytics & Tracking

### **Google Analytics 4**
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

### **Game Analytics**
- Track session length
- Monitor retention rates
- Analyze skin purchases
- Measure viral sharing

---

## 🔧 Performance Optimization

### **Critical Metrics**
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

### **Optimization Steps**
1. **Image Optimization**
   ```bash
   # Compress images
   npm install imagemin-cli
   imagemin images/* --out-dir=dist/images
   ```

2. **Code Splitting**
   ```javascript
   // Lazy load features
   const leaderboard = () => import('./leaderboard.js');
   ```

3. **Caching Strategy**
   ```javascript
   // Service worker for offline play
   self.addEventListener('install', event => {
     event.waitUntil(
       caches.open('stacks-v1').then(cache => {
         return cache.addAll(['/', '/style.css', '/game.js']);
       })
     );
   });
   ```

---

## 🌍 CDN Configuration

### **Cloudflare Setup**
```yaml
# Page Rules for performance
https://stacks-game.com/*:
  - Cache Level: Everything
  - Edge Cache TTL: 1 month
  - Browser Cache TTL: 4 hours
```

### **AWS CloudFront**
- Origin: S3 bucket
- Cache: Static assets (1 month)
- Invalidations: Manual updates

---

## 📱 App Store Deployment

### **iOS App Store**
1. Apple Developer Account ($99/year)
2. Xcode project setup
3. App Store Connect configuration
4. Review process: 1-7 days

### **Google Play Store**
1. Google Play Console ($25 one-time)
2. Android App Bundle (AAB)
3. Content rating review
4. Review process: 1-3 days

---

## 🔒 Security & Compliance

### **CORS Configuration**
```javascript
// Allow social sharing
app.use(cors({
  origin: ['https://tiktok.com', 'https://twitter.com']
}));
```

### **Privacy Policy**
- Data collection disclosure
- Cookie usage
- Third-party integrations
- User rights

---

## 📈 Scaling Architecture

### **Backend Services**
```yaml
# Firebase/Supabase for:
- User authentication
- Real-time leaderboards
- Progress synchronization
- Analytics tracking
```

### **Load Balancing**
```yaml
# Cloudflare Load Balancer
- Geographic distribution
- Health checks
- Failover protection
- SSL termination
```

---

## 💰 Monetization Integration

### **In-App Purchases**
```javascript
// Apple App Store
import { InAppPurchase } from '@capacitor/app-store';

// Google Play Store
import { InAppPurchase } from '@capacitor/google-play';
```

### **Ad Integration**
```javascript
// AdMob integration
import { AdMob } from '@capacitor/admob';

// Rewarded ads for extra coins
await AdMob.showRewardedAd({
  adId: 'rewarded-ad-id'
});
```

---

## 🚀 Deployment Checklist

### **Pre-Deployment**
- [ ] Test on all target devices
- [ ] Optimize images and assets
- [ ] Set up analytics
- [ ] Configure error tracking
- [ ] Test offline functionality
- [ ] Performance audit (Lighthouse)

### **Post-Deployment**
- [ ] Monitor performance metrics
- [ ] Set up error alerts
- [ ] Track user analytics
- [ ] A/B test features
- [ ] Gather user feedback

---

## 🎯 Next Steps

1. **Deploy to Vercel** (recommended for speed)
2. **Add analytics** to track retention
3. **Implement PWA** for app-like experience
4. **Set up A/B testing** for conversion optimization
5. **Plan mobile app** development

---

## 📞 Support

For deployment issues:
- Check browser console for errors
- Verify file paths in index.html
- Test local build before deployment
- Monitor network requests in DevTools

**Game URL:** [Your deployed URL here]

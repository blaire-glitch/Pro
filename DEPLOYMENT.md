# 🚀 Afrionex Testing Environment Setup Guide

Complete guide to deploy Afrionex for **FREE** (KSh 0-150/month)

---

## 📋 Overview

| Component | Service | Cost |
|-----------|---------|------|
| Web App | Cloudflare Pages / Vercel | FREE |
| Backend API | Railway | FREE |
| Database | Neon PostgreSQL | FREE |
| File Storage | Cloudinary | FREE |
| Push Notifications | Firebase FCM | FREE |
| Payments | M-Pesa/Flutterwave Sandbox | FREE |
| Email | Brevo | FREE |
| SMS | Africa's Talking Sandbox | FREE |
| Domain (optional) | Namecheap | ~KSh 100/mo |

**Total: KSh 0-150/month**

---

## 🔧 Step 1: Set Up Neon Database (FREE)

### 1.1 Create Account
1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub
3. Create new project: "afrionex"

### 1.2 Get Connection String
1. Go to Dashboard → Connection Details
2. Copy the connection string:
```
postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/afrionex?sslmode=require
```

### 1.3 Run Migrations
```bash
cd server
# Update .env with your Neon DATABASE_URL
npx prisma migrate deploy
npx prisma db seed
```

---

## 🔧 Step 2: Set Up Cloudinary (FREE)

### 2.1 Create Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up (Free tier: 25 credits/month)

### 2.2 Get Credentials
From Dashboard, copy:
- Cloud Name
- API Key  
- API Secret

### 2.3 Create Upload Preset
1. Settings → Upload → Upload Presets
2. Add preset: "afrionex-unsigned"
3. Signing Mode: Unsigned
4. Folder: afrionex

---

## 🔧 Step 3: Set Up M-Pesa Sandbox (FREE)

### 3.1 Create Developer Account
1. Go to [developer.safaricom.co.ke](https://developer.safaricom.co.ke)
2. Create account and verify email

### 3.2 Create Sandbox App
1. My Apps → Create New App
2. Select: Lipa Na M-Pesa Sandbox
3. Copy Consumer Key & Consumer Secret

### 3.3 Sandbox Test Credentials
```
Shortcode: 174379
Passkey: bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
Test Phone: 254708374149
```

---

## 🔧 Step 4: Set Up Firebase (FREE)

### 4.1 Create Project
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create project: "afrionex-test"

### 4.2 Enable Cloud Messaging
1. Project Settings → Cloud Messaging
2. Enable FCM

### 4.3 Get Service Account
1. Project Settings → Service Accounts
2. Generate new private key
3. Download JSON file

### 4.4 Web Push (VAPID Key)
1. Project Settings → Cloud Messaging → Web Push certificates
2. Generate key pair
3. Copy the VAPID key

---

## 🔧 Step 5: Deploy Backend to Railway (FREE)

### 5.1 Create Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

### 5.2 Deploy
```bash
# Option 1: Deploy from GitHub
1. New Project → Deploy from GitHub repo
2. Select: blaire-glitch/Pro
3. Configure: Root directory = server

# Option 2: Railway CLI
npm install -g @railway/cli
railway login
cd server
railway init
railway up
```

### 5.3 Set Environment Variables
In Railway Dashboard → Variables, add:
```
NODE_ENV=production
DATABASE_URL=<your-neon-url>
JWT_SECRET=<generate-random-32-char>
JWT_REFRESH_SECRET=<generate-random-32-char>
MPESA_CONSUMER_KEY=<your-key>
MPESA_CONSUMER_SECRET=<your-secret>
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_SHORTCODE=174379
MPESA_ENV=sandbox
CLOUDINARY_CLOUD_NAME=<your-cloud>
CLOUDINARY_API_KEY=<your-key>
CLOUDINARY_API_SECRET=<your-secret>
FRONTEND_URL=https://afrionex-web.pages.dev
```

### 5.4 Get API URL
After deploy: `https://afrionex-api.up.railway.app`

---

## 🔧 Step 6: Deploy Frontend to Cloudflare Pages (FREE)

### 6.1 Create Account
1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Sign up

### 6.2 Connect Repository
1. Create new project
2. Connect GitHub: blaire-glitch/Pro
3. Configure:
   - Framework: Next.js
   - Root directory: client
   - Build command: npm run build
   - Output: .next

### 6.3 Set Environment Variables
```
NEXT_PUBLIC_API_URL=https://afrionex-api.up.railway.app
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloud>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=afrionex-test
```

### 6.4 Get Web URL
After deploy: `https://afrionex-web.pages.dev`

---

## 🔧 Step 7: Set Up Email - Brevo (FREE)

### 7.1 Create Account
1. Go to [brevo.com](https://www.brevo.com)
2. Sign up (Free: 300 emails/day)

### 7.2 Get API Key
1. SMTP & API → API Keys
2. Create new key

### 7.3 Add to Railway
```
BREVO_API_KEY=<your-key>
EMAIL_FROM=noreply@afrionex.com
```

---

## 🔧 Step 8: Set Up SMS - Africa's Talking (FREE Sandbox)

### 8.1 Create Account
1. Go to [africastalking.com](https://africastalking.com)
2. Sign up → Go to Sandbox

### 8.2 Get Sandbox Credentials
```
AT_API_KEY=<sandbox-api-key>
AT_USERNAME=sandbox
```

---

## 📱 Step 9: Test Mobile App

### 9.1 Update API URL
In your Flutter/React Native app:
```dart
const API_URL = 'https://afrionex-api.up.railway.app';
```

### 9.2 Configure Firebase
1. Add `google-services.json` (Android)
2. Add `GoogleService-Info.plist` (iOS)

### 9.3 Test on Device
```bash
# Flutter
flutter run

# React Native
npx react-native run-android
npx react-native run-ios
```

---

## ✅ Step 10: Verify Everything Works

### Test Checklist

- [ ] Web app loads at `https://afrionex-web.pages.dev`
- [ ] API responds at `https://afrionex-api.up.railway.app/health`
- [ ] User registration works
- [ ] User login works
- [ ] Provider registration works
- [ ] File uploads work
- [ ] M-Pesa STK Push works (sandbox)
- [ ] Push notifications work
- [ ] WebSocket connections work

### Test M-Pesa Payment
```bash
curl -X POST https://afrionex-api.up.railway.app/api/payments/mpesa/stkpush \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "254708374149",
    "amount": 100,
    "accountReference": "TEST001"
  }'
```

---

## 🔄 Automatic Deployments

With the GitHub Actions workflow (`.github/workflows/deploy.yml`):

1. Push to `main` branch
2. Tests run automatically
3. Frontend deploys to Cloudflare
4. Backend deploys to Railway
5. Database migrations run

---

## 📊 Monitoring (FREE)

### Railway
- Built-in logs
- Metrics dashboard

### Cloudflare
- Web Analytics (free)
- Performance metrics

### Better Stack (Optional)
- Free tier: 1GB logs/month
- [betterstack.com](https://betterstack.com)

---

## 🆘 Troubleshooting

### Database Connection Issues
```bash
# Test connection
npx prisma db pull
```

### Railway Deploy Fails
1. Check build logs
2. Ensure Dockerfile is correct
3. Verify environment variables

### Cloudflare Build Fails
1. Check Next.js version compatibility
2. Verify build command
3. Check environment variables

### M-Pesa Callback Not Working
1. Ensure callback URL is HTTPS
2. URL must be publicly accessible
3. Check Railway logs for incoming requests

---

## 💰 Cost Summary

| Service | Free Tier Limits | Monthly Cost |
|---------|-----------------|--------------|
| Neon | 500MB storage | KSh 0 |
| Railway | 500 hours/month | KSh 0 |
| Cloudflare Pages | Unlimited sites | KSh 0 |
| Cloudinary | 25 credits/month | KSh 0 |
| Firebase FCM | Unlimited | KSh 0 |
| M-Pesa Sandbox | Unlimited tests | KSh 0 |
| Brevo | 300 emails/day | KSh 0 |
| AT Sandbox | Unlimited | KSh 0 |
| **Domain** | Optional | ~KSh 100 |

### **Total: KSh 0-150/month** 🎉

---

## 🚀 Ready for Production?

When ready to go live:

1. **M-Pesa**: Apply for production credentials
2. **Database**: Upgrade Neon plan if needed
3. **Domain**: Purchase custom domain
4. **SSL**: Cloudflare provides free SSL
5. **Monitoring**: Add error tracking (Sentry free tier)

Good luck with Afrionex! 🌍

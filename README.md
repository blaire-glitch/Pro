# Afrionex - The Next-Generation Super App for Africa

Afrionex is a next-generation super app designed to simplify life across Africa. One platform, one wallet, one seamless experience. Life moves fast. Afrionex moves with you.

## 📍 Currently Live In

**Western Kenya** - Growing fast!
- 🏙️ Kisumu
- 🏙️ Kakamega  
- 🏙️ Bungoma
- 🏙️ Busia

## 🌟 Features

### For Customers
- **Smart Search**: Find services by category, location, and ratings
- **Easy Booking**: Book services with preferred date, time, and location
- **Multiple Payment Options**: M-Pesa, Airtel Money, and card payments
- **Real-time Tracking**: Track your service provider's arrival
- **Reviews & Ratings**: Rate services and read trusted reviews
- **Loyalty Rewards**: Earn points and unlock exclusive rewards

### For Service Providers
- **Business Dashboard**: Track earnings, bookings, and analytics
- **Smart Calendar**: Manage availability and appointments
- **ShareLink**: Personal marketing link to share on social media
- **Subscription Packages**: Basic, Premium, and Elite tiers
- **Performance Insights**: Detailed analytics and reports

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand, React Query
- **UI Components**: Headless UI, React Icons
- **Animations**: Framer Motion

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Real-time**: Socket.io
- **Validation**: Zod

## 📦 Project Structure

```
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # Reusable components
│   │   ├── lib/           # Utilities and API client
│   │   └── store/         # Zustand stores
│   └── public/            # Static assets
│
├── server/                 # Express backend
│   ├── prisma/            # Database schema and migrations
│   └── src/
│       ├── middleware/    # Express middleware
│       ├── routes/        # API routes
│       └── lib/           # Utilities
│
└── shared/                 # Shared types and utilities
    ├── types/
    ├── constants/
    └── utils/
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-org/afrionex.git
cd afrionex
```

2. **Install dependencies**
```bash
# Install shared dependencies
cd shared && npm install

# Install server dependencies
cd ../server && npm install

# Install client dependencies
cd ../client && npm install
```

3. **Set up environment variables**
```bash
# Server
cp server/.env.example server/.env
# Update the .env file with your database credentials and API keys

# Client
cp client/.env.example client/.env.local
```

4. **Set up the database**
```bash
cd server
npx prisma migrate dev --name init
npx prisma db seed
```

5. **Start the development servers**
```bash
# Terminal 1: Start the backend
cd server && npm run dev

# Terminal 2: Start the frontend
cd client && npm run dev
```

6. **Open the app**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📱 Key Pages

| Page | Description |
|------|-------------|
| `/` | Homepage with categories and featured providers |
| `/search` | Search and filter providers |
| `/provider/[id]` | Provider profile and services |
| `/login` | Customer login |
| `/register` | Customer registration |
| `/dashboard` | Customer dashboard |
| `/provider/dashboard` | Provider analytics dashboard |

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Providers
- `GET /api/providers` - List providers
- `GET /api/providers/nearby` - Get nearby providers
- `GET /api/providers/:id` - Get provider details
- `GET /api/providers/:id/services` - Get provider services

### Bookings
- `GET /api/bookings` - List user bookings
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/:id/cancel` - Cancel booking
- `PATCH /api/bookings/:id/reschedule` - Reschedule booking

### Payments
- `POST /api/payments/initiate` - Initiate payment
- `POST /api/payments/mpesa/callback` - M-Pesa callback
- `GET /api/payments/:id/status` - Check payment status

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/provider/:id` - Get provider reviews

## 💰 Payment Integration

### M-Pesa
The platform integrates with Safaricom M-Pesa for mobile payments:
1. Customer initiates payment
2. STK Push sent to customer's phone
3. Customer enters PIN
4. Callback received with payment status
5. Booking confirmed on successful payment

### Airtel Money
Similar flow for Airtel Money integration with the Airtel Money API.

## 🔔 Real-time Features

Socket.io is used for:
- Live booking notifications
- Provider availability updates
- Chat messages
- Service provider location tracking

## 📊 Analytics

Providers can track:
- Daily/weekly/monthly earnings
- Booking trends
- Customer demographics
- Service popularity
- Review sentiment

## 🛡 Security

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation with Zod
- CORS configuration
- Helmet.js security headers

## 📦 Deployment

### Backend
```bash
cd server
npm run build
npm start
```

### Frontend
```bash
cd client
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details.

## 📞 Support

- Email: support@afrionex.com
- Phone: +254 700 000 000
- Website: https://afrionex.com

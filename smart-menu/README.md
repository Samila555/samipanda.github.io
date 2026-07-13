# Smart Menu - Digital Menu System for Hotels & Restaurants

A modern full-stack web application that replaces traditional paper menus with a QR-code-powered digital menu system.

## Tech Stack

- **Frontend:** React.js, React Router, Axios, Tailwind CSS, Lucide Icons, Recharts
- **Backend:** Node.js, Express.js, JWT Authentication, Multer
- **Database:** MongoDB, Mongoose ODM
- **Other:** QR Code Generator, Cloudinary (optional)

## Features

### Customer Side
- Browse menu by categories (Breakfast, Lunch, Dinner, Drinks, Desserts, Special Offers)
- View meal details with nutrition info (calories, protein, carbs, fat)
- Search and filter meals by category, price, and name
- Submit feedback with ratings (1-5 stars)
- Upload payment screenshots for proof of payment
- Dark/Light mode toggle
- Fully responsive mobile-first design

### Admin Side
- Secure JWT authentication (Admin/Manager roles)
- Dashboard with stats (total meals, categories, feedbacks, payments, revenue)
- Category management (CRUD)
- Meal management with image upload and nutrition data
- QR Code generation and download
- Payment verification (approve/reject)
- Feedback management with response capability
- Role-based access control

## Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Git

### 1. Clone the repository
```bash
git clone <repository-url>
cd smart-menu
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-menu
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Seed the database:
```bash
npm run seed
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Application
- **Customer Menu:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin/login
- **API:** http://localhost:5000/api

### Default Credentials
- **Admin:** admin@smartmenu.com / admin123
- **Manager:** manager@smartmenu.com / manager123

## Project Structure
```
smart-menu/
├── backend/
│   ├── config/          # Database and Cloudinary config
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth and upload middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # Express routes
│   ├── uploads/         # Uploaded images
│   ├── server.js        # Entry point
│   └── seed.js          # Database seeder
├── frontend/
│   ├── src/
│   │   ├── api/         # Axios configuration
│   │   ├── components/  # Shared components
│   │   ├── context/     # Auth context
│   │   ├── pages/
│   │   │   ├── customer/  # Customer-facing pages
│   │   │   └── admin/     # Admin pages
│   │   ├── App.jsx      # Main app with routing
│   │   └── main.jsx     # Entry point
│   ├── index.html
│   └── package.json
├── README.md
└── .gitignore
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/me` - Get current user

### Categories
- `GET /api/categories` - Get all
- `POST /api/categories` - Create (auth)
- `PUT /api/categories/:id` - Update (auth)
- `DELETE /api/categories/:id` - Delete (auth)

### Meals
- `GET /api/meals` - Get all (with filters)
- `GET /api/meals/:id` - Get one
- `POST /api/meals` - Create (auth)
- `PUT /api/meals/:id` - Update (auth)
- `DELETE /api/meals/:id` - Delete (auth)

### Feedback
- `GET /api/feedback` - Get all
- `POST /api/feedback` - Submit
- `DELETE /api/feedback/:id` - Delete (auth)
- `PUT /api/feedback/:id/respond` - Respond (auth)

### Payments
- `GET /api/payments` - Get all (auth)
- `POST /api/payments` - Submit with screenshot
- `PUT /api/payments/:id` - Update status (auth)

### QR Codes
- `GET /api/qrcode` - Get all (auth)
- `POST /api/qrcode/generate` - Generate (auth)
- `DELETE /api/qrcode/:id` - Delete (auth)

### Dashboard
- `GET /api/dashboard` - Get stats (auth)

## Deployment

### Backend (Render)
1. Push to GitHub
2. Create a new Web Service on Render
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables in Render dashboard

### Frontend (Vercel)
1. Push to GitHub
2. Import project in Vercel
3. Set root directory: `frontend`
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com`

### Database (MongoDB Atlas)
1. Create free cluster on MongoDB Atlas
2. Get connection string
3. Set MONGODB_URI in backend environment variables
4. Whitelist Render/Vercel IPs in Atlas Network Access

## License
MIT

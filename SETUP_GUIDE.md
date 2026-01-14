# DealVictor MERN - Setup & Testing Guide

## Quick Setup

### 1. Install Dependencies

#### Backend
```bash
cd dealvictor-mern/backend
npm install
```

#### Frontend
```bash
cd dealvictor-mern/frontend
npm install
```

### 2. Configure Environment

Create `.env` file in backend folder (already included):
```
MONGO_URI=mongodb://localhost:27017/dealvictor
JWT_SECRET=dealvictor_secret_key_2024_very_secure
JWT_EXPIRE=30d
PORT=5000
NODE_ENV=development
```

### 3. Seed Database with Real Data

Run this command to populate database with sample data:
```bash
cd dealvictor-mern/backend
node scripts/seed.js
```

This will create:
- Admin user
- Sample freelancers
- Sample buyers/sellers
- Services
- Projects
- Products
- Categories

### 4. Start the Application

#### Terminal 1 - Backend
```bash
cd dealvictor-mern/backend
npm start
```
Wait for: "Connected to MongoDB" and "Server running on port 5000"

#### Terminal 2 - Frontend
```bash
cd dealvictor-mern/frontend
npm start
```
Wait for: "Compiled successfully"

### 5. Open in Browser
Navigate to: http://localhost:3000

---

## Login Credentials

### Admin Account
- **Email:** admin@dealvictor.com
- **Password:** admin123
- **Access:** Full admin panel at /admin

### Freelancer Account
- **Email:** sunilsharmaftp@gmail.com
- **Password:** password123
- **Access:** Can bid on projects, offer services

### Buyer/Client Account
- **Email:** john@example.com
- **Password:** password123
- **Access:** Can post projects, hire freelancers

### Seller Account
- **Email:** sarah@example.com
- **Password:** password123
- **Access:** Can sell products in shop

---

## Features Testing Checklist

### Authentication
- [x] Registration - Create new account
- [x] Login - Sign in with credentials
- [x] Logout - Sign out
- [x] Password validation (8+ chars, uppercase, lowercase, number)

### Shop/Products
- [x] View products grid
- [x] Filter by category
- [x] Filter by price range
- [x] Add to cart
- [x] View cart
- [x] Update quantity in cart
- [x] Remove from cart
- [x] Cart count in navbar

### Services
- [x] Browse services
- [x] View service details
- [x] Service packages (Basic/Standard/Premium)

### Projects
- [x] View open projects
- [x] Post new project (requires login)
- [x] Bid on projects (freelancer account)

### User Dashboard
- [x] View dashboard stats
- [x] Profile settings
- [x] Account settings

### Admin Panel (/admin)
- [x] Dashboard overview
- [x] User management
- [x] Project management
- [x] Order management
- [x] Settings

---

## API Endpoints

### Auth
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user
- POST /api/auth/logout - Logout user

### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get single product
- POST /api/products - Create product (seller)
- PUT /api/products/:id - Update product
- DELETE /api/products/:id - Delete product

### Services
- GET /api/services - Get all services
- GET /api/services/:id - Get single service
- POST /api/services - Create service (freelancer)

### Projects
- GET /api/projects - Get all projects
- GET /api/projects/:id - Get single project
- POST /api/projects - Create project (client)
- POST /api/bids - Submit bid (freelancer)

---

## Troubleshooting

### MongoDB Connection Error
Make sure MongoDB is running:
- Windows: Check Services for "MongoDB"
- Mac/Linux: `mongod` command

### Port Already in Use
Kill the process using port 5000 or 3000:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
kill -9 $(lsof -t -i:5000)
```

### Registration Not Working
1. Check backend is running (port 5000)
2. Check MongoDB is connected
3. Check browser console for errors
4. Make sure frontend is making requests to http://localhost:5000

---

## Contact

For any issues or questions, contact the developer.

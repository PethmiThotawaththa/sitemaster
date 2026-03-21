# SiteMaster - Construction Management System

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3+-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18+-black?style=flat-square&logo=express)](https://expressjs.com/)

A comprehensive full-stack construction management system designed to streamline project tracking, inventory management, financial operations, and order processing for construction enterprises.

[Installation](#installation) • [Features](#features) • [Architecture](#architecture) • [API Documentation](#api-documentation) • [Development](#development)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication & Authorization](#authentication--authorization)
- [File Upload Handling](#file-upload-handling)
- [Development Guidelines](#development-guidelines)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**SiteMaster** is a sophisticated, enterprise-grade construction management platform that brings organization and efficiency to construction projects. The system enables seamless communication between administrators, project managers, and team members through an intuitive interface and powerful backend infrastructure.

### Key Use Cases

- **Project Management**: Create, track, and manage construction projects from inception to completion
- **Inventory Control**: Maintain real-time inventory of materials, equipment, and resources
- **Financial Management**: Process payments, track expenses, generate financial reports
- **Order Processing**: Manage purchase orders, supplier interactions, and delivery tracking
- **User Management**: Administrative control over users, roles, and permissions
- **Notifications**: Real-time alerts for project updates, order status, and system events

---

## Features

### 🔐 Admin & Authentication
- JWT-based authentication with secure token management
- Role-based access control (Admin, Manager, User)
- User registration and email verification
- Password reset functionality with secure token validation
- Admin registration and user management interface

### 📊 Project Management
- Create and manage construction projects
- Track project status, timelines, and budgets
- Assign team members to projects
- Project documentation and file attachments
- Real-time project status updates

### 📦 Inventory Management
- Track materials and equipment inventory
- Real-time stock level monitoring
- Upload inventory images and documentation
- Inventory categorization and filtering
- Low stock alerts and notifications

### 💰 Financial Management
- Payment processing and tracking
- Invoice generation and management
- Financial reporting and analytics
- Expense categorization and budgeting
- Multi-currency support ready

### 🛒 Shopping Cart & Orders
- Add-to-cart functionality for materials
- Order creation and management
- Order status tracking (Pending, Processing, Shipped, Delivered)
- Order history and analytics
- PDF order confirmation generation

### 🔔 Notifications
- Real-time notification system
- Email notifications via Nodemailer
- Notification categories (Order, Project, Payment, System)
- Read/Unread status tracking
- Notification preferences

### 🎨 User Dashboard
- Personalized user dashboards
- Quick access to recent projects and orders
- Financial overview and summaries
- Profile management and settings
- Password change functionality

---

## Technology Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | LTS | JavaScript runtime |
| **Express.js** | 4.18+ | Web framework |
| **MongoDB** | 7.0+ | NoSQL database |
| **Mongoose** | 7.0+ | Database ORM |
| **JWT** | 9.0+ | Authentication |
| **Bcryptjs** | 2.4+ | Password hashing |
| **Multer** | 1.4+ | File upload handling |
| **Nodemailer** | 6.10+ | Email service |
| **PDFKit** | 0.17+ | PDF generation |
| **CORS** | 2.8+ | Cross-origin requests |
| **Dotenv** | 16.0+ | Environment variables |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3+ | UI library |
| **Vite** | 6.2+ | Build tool & dev server |
| **React Router** | 7.4+ | Client-side routing |
| **Chakra UI** | 2.10+ | Component library |
| **Zustand** | 5.0+ | State management |
| **Axios** | 1.8+ | HTTP client |
| **Framer Motion** | 12.5+ | Animation library |
| **jsPDF** | 3.0+ | PDF generation |
| **ESLint** | 9.21+ | Code linting |

---

## Project Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                   Frontend (React/Vite)                      │
│                 (Port 5173 - Development)                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Components | Routing | State Management (Zustand)           │
│         ↓                                                      │
│     Services Layer (Axios HTTP Calls)                        │
│         ↓                                                      │
├─────────────────────────────────────────────────────────────┤
│              REST API (Express.js Middleware)                │
│                 (Port 3000 - Backend)                        │
│                                                               │
│  Routes | Controllers | Middleware | Error Handling          │
│         ↓                                                      │
│  Business Logic Layer                                         │
│         ↓                                                      │
├─────────────────────────────────────────────────────────────┤
│              Data Layer (MongoDB)                            │
│                                                               │
│  Models | Schemas | Database Queries                        │
│         ↓                                                      │
│  File Storage (Local /uploads directory)                     │
└─────────────────────────────────────────────────────────────┘
```

### Microservice-Style Organization

The backend follows a feature-based architecture with clear separation of concerns:

- **Controllers**: Handle HTTP requests/responses
- **Models**: Define data structures and relationships
- **Routes**: Map URL endpoints to controller methods
- **Middleware**: Cross-cutting concerns (auth, errors, uploads)
- **Config**: Database and environment setup
- **Utils**: Shared utilities (JWT, helpers)

---

## Installation & Setup

### Prerequisites

- **Node.js** (v16 or higher recommended)
- **npm** or **yarn** package manager
- **MongoDB** (local installation or Atlas connection string)
- **Git** (for version control)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd SiteMaster
```

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (see Configuration section)
cp .env.example .env  # or create manually

# Start the development server
npm run dev

# In production
npm start
```

### Step 3: Frontend Setup

```bash
# From root directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/sitemaster
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sitemaster

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_token_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@sitemaster.com

# File Upload
MAX_FILE_SIZE=5242880  # 5MB in bytes
UPLOAD_DIR=uploads

# API Configuration
API_TIMEOUT=30000
MAX_REQUEST_SIZE=10mb
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=SiteMaster
VITE_APP_VERSION=1.0.0
```

---

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Application runs on http://localhost:5173
```

### Production Mode

**Backend:**
```bash
cd backend
npm start
# Ensure NODE_ENV=production in .env
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
# Or serve the dist/ folder using production server
```

---

## Project Structure

### Backend Directory Structure

```
backend/
├── config/
│   └── db.js                    # MongoDB connection configuration
├── controllers/                 # Business logic for routes
│   ├── adminController.js       # Admin management operations
│   ├── authController.js        # Authentication logic
│   ├── cartController.js        # Shopping cart operations
│   ├── financialController.js   # Financial & payment reports
│   ├── inventoryController.js   # Inventory management
│   ├── notificationController.js# Notification operations
│   ├── orderController.js       # Order processing
│   ├── paymentController.js     # Payment handling
│   ├── projectController.js     # Project management
│   ├── settingsController.js    # System settings
│   └── userController.js        # User profile management
├── middleware/
│   ├── authMiddleware.js        # JWT verification
│   ├── errorMiddleware.js       # Global error handling
│   └── uploadMiddleware.js      # File upload handling
├── models/                      # Mongoose schemas
│   ├── Cart.js
│   ├── Inventory.js
│   ├── Notification.js
│   ├── Order.js
│   ├── Payment.js
│   ├── Project.js
│   ├── Settings.js
│   └── User.js
├── routes/                      # API route definitions
│   ├── adminRoutes.js
│   ├── adminOrderRoutes.js
│   ├── authRoutes.js
│   ├── cartRoutes.js
│   ├── financialRoutes.js
│   ├── inventoryRoutes.js
│   ├── orderRoutes.js
│   ├── paymentRoutes.js
│   ├── projectRoutes.js
│   └── userRoutes.js
├── uploads/                     # User-uploaded files
│   ├── inventory/              # Product/inventory images
│   ├── payments/               # Payment receipts
│   └── projects/               # Project documentation
├── utils/
│   └── jwt.js                  # JWT utility functions
├── scripts/                     # Database scripts, seeders
├── app.js                       # Express app configuration
├── server.js                    # Server entry point
├── test.js                      # Test file
└── package.json
```

### Frontend Directory Structure

```
frontend/
├── src/
│   ├── components/              # React components
│   │   ├── admin/               # Admin dashboard components
│   │   ├── auth/                # Auth pages (Login, Register, etc.)
│   │   ├── cart/                # Shopping cart components
│   │   ├── common/              # Shared components
│   │   ├── dashboard/           # User dashboard
│   │   ├── financial/           # Financial reports
│   │   ├── home/                # Homepage
│   │   ├── inventory/           # Inventory pages
│   │   ├── layout/              # Layout components (Navbar, Footer)
│   │   ├── projects/            # Project components
│   │   ├── user/                # User profile/settings
│   │   ├── AboutUs.jsx          # About page
│   │   ├── ContactUs.jsx        # Contact page
│   │   ├── ErrorBoundary.jsx    # Error boundary component
│   │   └── Navbar.jsx           # Navigation bar
│   ├── services/
│   │   └── userService.js       # API calls
│   ├── store/                   # Zustand stores (state management)
│   │   ├── adminUserStore.js
│   │   ├── cartStore.js
│   │   ├── inventoryStore.js
│   │   ├── projectStore.js
│   │   └── userStore.js
│   ├── stores/                  # Additional stores
│   ├── assets/
│   │   └── images/              # Static images
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles
├── public/                      # Public static assets
├── vite.config.js               # Vite configuration
├── eslint.config.js             # ESLint rules
├── index.html                   # HTML template
└── package.json
```

---

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "fullName": "John Doe"
}

Response: 201 Created
{
  "success": true,
  "token": "eyJhbGc...",
  "user": { ... }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response: 200 OK
{
  "success": true,
  "token": "eyJhbGc...",
  "user": { ... }
}
```

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}

Response: 200 OK
{
  "success": true,
  "message": "Reset link sent to email"
}
```

### Project Endpoints

#### Get All Projects
```http
GET /api/projects
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "projects": [ ... ],
  "count": 10
}
```

#### Create Project
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Downtown Complex",
  "description": "New office building",
  "budget": 500000,
  "startDate": "2026-04-01",
  "endDate": "2027-04-01"
}
```

#### Update Project
```http
PUT /api/projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "In Progress",
  "progress": 45
}
```

### Inventory Endpoints

#### Get Inventory
```http
GET /api/inventory
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "items": [ ... ]
}
```

#### Add Inventory Item (with Image)
```http
POST /api/inventory
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "name": "Steel Beams",
  "quantity": 100,
  "unit": "pieces",
  "price": 250,
  "category": "Materials",
  "image": <binary-file>
}
```

### Payment & Financial Endpoints

#### Process Payment
```http
POST /api/payments
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "orderId": "63f7d8e9...",
  "amount": 5000,
  "paymentMethod": "bank_transfer",
  "receipt": <binary-file>
}
```

#### Get Financial Reports
```http
GET /api/financial/reports?month=3&year=2026
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "totalRevenue": 150000,
  "totalExpenses": 85000,
  "transactions": [ ... ]
}
```

### Order Endpoints

#### Create Order
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    { "inventoryId": "63f7d8e9...", "quantity": 50 }
  ],
  "deliveryAddress": "123 Main St"
}
```

#### Get Order Status
```http
GET /api/orders/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "order": { ... }
}
```

---

## Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  fullName: String,
  role: enum ['user', 'admin', 'manager'],
  phoneNumber: String,
  address: String,
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean
}
```

### Project Model
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  budget: Number,
  startDate: Date,
  endDate: Date,
  status: enum ['Planning', 'In Progress', 'On Hold', 'Completed'],
  progress: Number (0-100),
  manager: ObjectId (User reference),
  team: [ObjectId] (User references),
  createdAt: Date,
  updatedAt: Date
}
```

### Inventory Model
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  quantity: Number,
  unit: String,
  price: Number,
  category: String,
  image: String (file path),
  lowStockThreshold: Number,
  supplier: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```javascript
{
  _id: ObjectId,
  orderNumber: String (unique),
  userId: ObjectId (User reference),
  items: [{
    inventoryId: ObjectId,
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: enum ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
  deliveryAddress: String,
  orderDate: Date,
  expectedDelivery: Date,
  actualDelivery: Date
}
```

### Payment Model
```javascript
{
  _id: ObjectId,
  orderId: ObjectId (Order reference),
  userId: ObjectId (User reference),
  amount: Number,
  status: enum ['Pending', 'Completed', 'Failed', 'Refunded'],
  paymentMethod: String,
  transactionId: String (unique),
  receipt: String (file path),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Authentication & Authorization

### JWT Flow

1. **User Login/Registration** → Server generates JWT token (expires in 7 days)
2. **Token Storage** → Client stores token in localStorage (Zustand store)
3. **API Requests** → Token sent in `Authorization: Bearer <token>` header
4. **Token Validation** → Middleware verifies token signature and expiration
5. **Route Protection** → PrivateRoute component checks authentication status and role

### Role-Based Access Control (RBAC)

| Role | Permissions |
|------|------------|
| **Admin** | Full system access, user management, system settings |
| **Manager** | Create/edit projects, manage team, view reports |
| **User** | View own profile, access projects, create orders |

### Protected Routes Example

```javascript
<PrivateRoute roles={['admin']}>
  <AdminDashboard />
</PrivateRoute>

<PrivateRoute roles={['admin', 'manager']}>
  <Projects />
</PrivateRoute>

<PrivateRoute>
  <UserDashboard />
</PrivateRoute>
```

---

## File Upload Handling

### Supported File Types & Sizes

- **Images**: `.jpg`, `.jpeg`, `.png`, `.avif` (5MB max)
- **Documents**: `.pdf`, `.doc`, `.docx` (10MB max)
- **Directory Structure**:
  - `/uploads/inventory/` - Product images
  - `/uploads/payments/` - Payment receipts
  - `/uploads/projects/` - Project documentation

### Upload Example

```javascript
// Frontend (Axios)
const formData = new FormData();
formData.append('file', imageFile);
formData.append('category', 'inventory');

axios.post('/api/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// Backend (Express + Multer)
app.post('/uploads', upload.single('file'), (req, res) => {
  res.json({
    filePath: `/uploads/${req.file.filename}`,
    originalName: req.file.originalname
  });
});
```

### Static File Serving

```
GET /uploads/inventory/1746014888110-379514332.avif
// Returns image with appropriate CORS headers
```

---

## Development Guidelines

### Code Style

- **Backend**: Node.js conventions with modules
- **Frontend**: React/ES6+ with component-based architecture
- **Naming**: camelCase for variables, PascalCase for components
- **Comments**: JSDoc for functions, inline for complex logic

### Linting

```bash
# Frontend linting
cd frontend
npm run lint
```

### Best Practices

1. **Error Handling**: Use try-catch in async functions, centralized error middleware
2. **Validation**: Input validation on both client and server
3. **Security**: Sanitize inputs, use HTTPS in production, secure JWT secrets
4. **Performance**: Optimize database queries, implement pagination, lazy load components
5. **State Management**: Use Zustand stores for complex state, props for simple data
6. **API Calls**: Centralize in service files, implement error handling

### Adding New Features

1. Create model in `backend/models/`
2. Create controller in `backend/controllers/`
3. Create routes in `backend/routes/`
4. Register routes in `server.js`
5. Create service in `frontend/services/`
6. Create components in `frontend/components/`
7. Create Zustand store if needed
8. Add routes to `App.jsx`

---

## Troubleshooting

### Common Issues

#### "MongoDB Connection Failed"
```bash
# Check MongoDB is running
# Verify MONGODB_URI in .env
# For local MongoDB: mongodb://localhost:27017/sitemaster
# For Atlas: mongodb+srv://user:password@cluster.mongodb.net/sitemaster
```

#### "CORS Error"
```javascript
// Ensure FRONTEND_URL matches frontend origin
FRONTEND_URL=http://localhost:5173

// Check CORS middleware in server.js is enabled
```

#### "JWT Token Invalid"
```bash
# Token might be expired (expires in 7 days by default)
# Verify JWT_SECRET matches in .env
# Clear localStorage and re-login
```

#### "File Upload Not Working"
```bash
# Check /uploads directory exists and is writable
# Verify MAX_FILE_SIZE in .env matches file size
# Check file extension is allowed
```

#### "Image Not Displaying"
```bash
# Verify CORS headers are set for /uploads route
# Check image file path is correct
# Ensure file exists in uploads directory
```

### Debug Mode

**Backend:**
```bash
NODE_DEBUG=* npm run dev
```

**Frontend:**
```bash
# Check browser DevTools Console for errors
# Use React DevTools for state inspection
```

---

## Contributing

### Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes following code style guidelines
3. Test thoroughly (manual testing for now)
4. Commit with clear messages: `git commit -m "Add feature description"`
5. Push to repository: `git push origin feature/your-feature`
6. Create Pull Request with description

### Reporting Issues

- Use GitHub Issues for bug reports
- Include: environment details, steps to reproduce, expected vs actual behavior
- Attach screenshots/logs when relevant

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Support & Contact

For issues, questions, or suggestions:

- **Email**: support@sitemaster.com
- **Issues**: GitHub Issues
- **Documentation**: See individual file comments

---

<div align="center">

**Built with ❤️ for efficient construction management**

Last Updated: March 2026 | Version 1.0.0

</div>

# 📦 Smart Inventory Management System

A full-stack mobile application for managing products, inventory, and orders, built using the **MERN stack** and **React Native (Expo)**.

This project started as a simple product CRUD app and evolved into a complete **Inventory Management System** with authentication, product tracking, and advanced features.

---

## 🚀 Features

### 🔐 Authentication & User Management

* User registration and login
* JWT-based authentication
* Role-based access (Admin / User)
* Persistent login using AsyncStorage

### 📦 Product Management

* Create, update, delete products
* View product list and details
* Product categories
* Product image support (planned)
* Stock quantity tracking

### 🛒 Order & Cart System

* Add products to cart
* Create orders
* Order history tracking
* Order status management

### 📊 Dashboard & Analytics

* Total products overview
* Low stock alerts
* Sales and order tracking (planned)
* Visual insights (planned)

### 🔍 Search & Filtering

* Search products by name
* Filter by category
* Sort products

### 🎨 UI/UX

* Mobile-first design
* Clean and responsive layout
* Reusable components
* Loading and error states

---

## 🏗️ Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcryptjs

### Frontend (Mobile App)

* React Native (Expo)
* TypeScript
* Expo Router
* Context API
* AsyncStorage

---

## 📁 Project Structure

```
backend/
  models/
  controllers/
  routes/
  middleware/
  config/

mobile/
  app/
  components/
  services/
  context/
  hooks/
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/your-username/your-repo-name.git
```

### 2. Backend setup

```
cd backend
npm install
```

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```
node server.js
```

---

### 3. Mobile setup

```
cd mobile
npm install
npx expo start
```

Scan the QR code using Expo Go.

---

## 📱 Running the App

* Ensure your phone and computer are on the same network
* Use your local IP address in API calls
* Backend must be running before starting the mobile app

---

## 👥 Team Structure

This project is developed as a group project with 5 members:

* Authentication & User Management
* Product Management
* Orders & Cart System
* Dashboard & UI/UX
* Backend Optimization & Deployment

---

## 🔮 Future Improvements

* Image upload with Cloudinary
* Push notifications
* Barcode scanning
* Offline support
* Advanced analytics and charts
* Deployment to cloud services

---

## 📌 Status

🚧 In active development — expanding from MVP to full production-level system.

---

## 📄 License

This project is for educational purposes.

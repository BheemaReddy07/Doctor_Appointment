# 🩺 Prescripto - Doctor Appointment Booking Platform

A full-stack doctor appointment booking web application built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js), designed for **Users**, **Doctors**, and **Admins**. Integrated with **Stripe** for secure online payments and **Cloudinary** for media storage.

---

## ✨ Features

### 👤 User
- 🔐 Login/Register & Reset password with **Email OTP verification**  
- 🔍 Browse doctors by category and specialization  
- 📅 Book, Cancel, or Reschedule appointments  
- 💳 Pay securely online using **Stripe**  
- 📜 View appointment history and details  

### 🩺 Doctor
- 📝 Edit personal profile and availability status  
- ✅ Accept or Reject appointment requests  
- 📊 View earnings from completed appointments  

### 🛠️ Admin
- ➕ Add new doctors to the platform  
- 👁 Monitor doctor availability & status  
- ✅ Accept/Reject appointments  
- 📉 Track total patients and bookings  

---

## 🧰 Tech Stack

| Layer     | Technology                           |
|-----------|--------------------------------------|
| Frontend  | React.js, shadcn/ui, CSS             |
| Backend   | Node.js, Express.js                  |
| Database  | MongoDB with Mongoose                |
| Auth      | JSON Web Tokens (JWT) + Email OTP    |
| Payments  | Stripe API                           |
| Media     | Cloudinary                           |
| Email     | Nodemailer                           |

---

## 👑 Default Credentials

### Admin
- **Email:** `admin@prescripto.com`  
- **Password:** `qwerty123`  

### Sample Doctor
- **Email:** `richardjames@prescripto.com`  
- **Password:** `123456789`  

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` folder:
- JWT_SECRET="your-jwt-secret"
- MONGO_URL="your-mongodb-url"
- STRIPE_SECRET_KEY="your-stripe-secret-key"
- USER_EMAIL="your-email-address"
- USER_APPCODE="your-email-app-password"
- ADMIN_EMAIL="admin@prescripto.com"
- ADMIN_PASSWORD="qwerty123"
- CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
- CLOUDINARY_API_KEY="your-cloudinary-api-key"
- CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
- FRONTENDURL="http://localhost:5173/"


## 🧑‍💻 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/BheemaReddy07/Doctor_Appointment.git
cd Food_delivery
```
### 2. Install Backend Dependencies
```bash
cd backend
npm install
```
### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```
### 4. Install Admin Dependencies
```bash
cd ../admin
npm install
```

### 5. Run the Project
```bash
# Start backend
cd backend
npm run dev

# Start frontend
cd ../frontend
npm start
```
---
##  Test Card (if using Stripe)
```bash
Card Number: 4242 4242 4242 4242
Expiry: Any future date
CVV: Any 3 digits
```

## Contact
Bheemareddy
- email:bheemareddy2910@gmail.com

🌟 If you like this project, give it a star!




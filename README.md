# **Dev Tinder - Backend**  
_Backend service for Dev Tinder, a platform for developers to connect and collaborate._  

## **📌 Overview**  
This repository contains the **backend services** for Dev Tinder, a developer networking platform. It is built using **Express JS** and **MongoDB** and provides secure **JWT authentication**, **user profile management**, and **connection request handling** through a **REST API**.  

🔗 **Live API Base URL**: [https://www.mydevtinder.com/api](https://www.mydevtinder.com/api)  

---

## **🚀 Features**  
- **JWT Authentication**:  
  Secure login and user authentication  
- **MongoDB Database**:  
  Store user data in a scalable way  
- **RESTful API Endpoints**:  
  - **Send**, **Accept/Deny** connection requests  
  - **Profile Management**  
- **Role-based Access Control (RBAC)**:  
  Ensure secure access to routes  
- **Postman for API Testing**:  
  Manually test the backend endpoints  

---

## **🛠 Tech Stack**  
- **Express JS** - Backend framework  
- **MongoDB** - NoSQL database  
- **JWT Authentication** - Secure user login  
- **Postman** - API testing  
- **AWS EC2** - Hosting backend  
- **Nginx** - Reverse proxy  

---

## **⚙️ Installation**  

### **1️⃣ Clone the repository**  
```bash
  git clone <backend-repo-url>
  cd dev-tinder-backend
```

### **2️⃣ Install dependencies**  
```bash
  npm install
```

### **3️⃣ Set up environment variables (.env file)**  

Create a `.env` file in the root directory and add the following:
```bash
  MONGO_URI=<your-mongodb-connection-string>
  JWT_SECRET=<your-secret-key>
  PORT=5000

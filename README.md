# 🧠 AI Notes Making Platform

Turn any blog, article, or URL into **clean, structured AI-generated notes** in seconds.  
Designed to save time, boost productivity, and make revision effortless.

A **secure, full-stack AI-powered application** built with real-world architecture and authentication.

---

## 🚀 Project Overview

The **AI Notes Making Platform** is a full-stack web application that allows users to generate **AI-powered notes** from articles or URLs and securely save them to their personal account.

Each user has their **own private workspace**, protected using **JWT-based authentication**, ensuring data security and isolation.

---

## 🎯 Why This Project?

People today:
- Read less, skim more
- Need quick summaries
- Want structured, revisable content

This platform automates note-making using AI while ensuring:
- 🔒 Secure user access
- 🧠 Clean and readable summaries
- ⚡ Fast processing

---

## ✨ Key Features

- 🔐 **JWT Authentication**
  - Secure login & signup
  - Protected routes
  - User-specific notes storage

- 🔗 **URL / Text Input**
- 🤖 **AI-Powered Notes Generation (Gemini API)**
- 🧩 **Structured & Readable Notes**
- 💾 **Save & Delete Notes**
- 📱 **Responsive UI**
- ⚡ **Fast API Response**
- 🔒 **Scalable Backend Design**

---

## 🛠️ Tech Stack

### Frontend
- **React.js**
- **CSS (Responsive Design)**

### Backend
- **Node.js**
- **Express.js**
- **JWT (JSON Web Tokens)** – Authentication & authorization
- **Prisma ORM**

### Database
- **PostgreSQL**

### AI Integration
- **Gemini API** – Intelligent summarization

---

## 🔐 Authentication Flow (JWT)

1. User signs up / logs in
2. Server validates credentials
3. JWT token is generated
4. Token is sent to client
5. Protected routes verify token
6. Notes are fetched **user-wise**

This ensures:
- Data privacy
- Secure API access
- Scalable auth system

---

## 🧠 How It Works

1. User logs in (JWT secured)
2. User submits a URL or article
3. Backend extracts content
4. Content is sent to **Gemini AI**
5. AI returns structured notes
6. Notes are stored in DB **mapped to user**
7. User can view, update, or delete notes

---

## 🗂️ Project Architecture

```txt
client/
 ├── components/
 ├── pages/
 ├── utlis/
 └── App.jsx

server/
 ├── routes/
 ├── controllers/
 ├── middleware/
 ├── prisma/
 ├── utils/
 └── index.js

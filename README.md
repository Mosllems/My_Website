# Personal Portfolio Website 🚀

A full-stack personal portfolio website with a **React** frontend and **Django REST Framework** backend, fully **Dockerized** for seamless development and deployment. Serves as a professional hub to showcase my projects, background, technical skills, and backend expertise.

## 🛠 Tech Stack

### Backend
- **Python 3.12, Django 6** — core framework
- **Django REST Framework** — RESTful API
- **djoser + SimpleJWT** — JWT-based authentication
- **PostgreSQL 15** — relational database
- **django-cors-headers** — CORS policy management
- **Docker & Docker Compose** — containerized infrastructure
- **Alpine Linux** — lightweight OS base image

### Frontend
- **React 18 + Vite** — fast modern UI
- **React Router DOM** — client-side navigation
- **Axios** — HTTP client for API communication
- **Three.js** — interactive particle background
- **CSS Modules** — scoped component styling

## 🌟 Key Features

### Frontend
- **4 Pages:** Home, About, Resume, Contact — all data-driven from the API
- **Three.js Particle Background** — animated across all pages
- **Scroll Reveal Animations** — IntersectionObserver-based entrance effects
- **Mobile Responsive** — hamburger menu, adaptive grids, tested down to 355px
- **Live Contact Form** — submits to the backend API with auto-dismiss feedback

### Backend & API
- **RESTful API Endpoints:**
  - `GET /api/profile/` — public profile info
  - `GET /api/skills/` — skills with categories
  - `GET /api/interests/` — personal interests
  - `GET /api/education/` — education history
  - `GET /api/experience/` — work experience
  - `POST /api/contact/` — contact form submissions
- **JWT Authentication** — secure token-based auth via djoser
- **Custom Permissions** — `IsAdminOrReadOnly` for all content endpoints
- **Rate Limiting** — contact form throttled to 10 requests/hour per IP
- **Public Registration Disabled** — only admins can create accounts

### Infrastructure
- **Multi-stage Docker Builds** — optimized for performance and small image sizes
- **Environment Management** — secure configuration using `.env` files
- **Robust Healthchecks** — PostgreSQL readiness check before Django starts
- **Security-First** — runs as a non-root user inside the container
- **Debug Toolbar** — conditionally loaded only when `DEBUG=True`
- **StatReloader** — real-time code updates during development

## 🚀 Quick Start (Local Setup)

### 1. Clone the repository
```bash
git clone https://github.com/Mosllems/My_Website.git
cd My_Website
```

### 2. Configure environment variables
Create a `.env` file in the root directory:
```env
DJANGO_SECRET_KEY=your_secret_key_here
DJANGO_DEBUG=True
DATABASE_NAME=My_Website
DATABASE_USER=postgres
DATABASE_PASSWORD=your_secure_password
DATABASE_HOST=db
ALLOWED_HOSTS=localhost,127.0.0.1
```

### 3. Build and run with Docker Compose
```bash
docker-compose up --build
```

| Service | URL |
|---------|-----|
| Backend API | http://localhost:8000/api/ |
| Django Admin | http://localhost:8000/admin/ |
| Frontend | http://localhost:5173/ |

## 📁 Project Structure
```
My_Website/
├── config/          # Django settings & URLs
├── accounts/        # Custom user model, profile API
├── pages/           # Skills, education, experience, contact API
├── Frontend/        # React + Vite application
│   └── src/
│       ├── pages/   # Home, About, Resume, Contact
│       ├── components/  # Navbar, shared components
│       └── api/     # Axios API calls
├── docker-compose.yml
└── .env
```

## 👨‍💻 About Me
I am an **AI enthusiast and Backend Developer** focused on building scalable systems and process automation.
- 🎓 **Academic Excellence:** Computer Engineering graduate with a GPA of 19.19/20
- ⚡ **Interests:** AI Engineering, Workflow Automation (n8n), and Local LLM implementations
- 🛠 **Core Skills:** Python (Django), React, Docker, PostgreSQL, and Machine Learning

---
Developed with ❤️ by Moslem Amiri

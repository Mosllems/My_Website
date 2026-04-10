# Personal Portfolio Website 🚀

This is my personal portfolio website, built with **Django** and fully **Dockerized** for seamless development and deployment. This platform serves as a professional hub to showcase my projects, my background,  technical skills, and backend expertise.

## 🛠 Tech Stack
- **Backend:** Python 3.12, Django 6
- **Database:** PostgreSQL 15
- **Infrastructure:** Docker & Docker Compose
- **OS Base:** Alpine Linux (Optimized for lightweight images)

## 🌟 Key Features
- **Multi-stage Docker Builds:** Optimized for performance and small image sizes.
- **Environment Management:** Secure configuration using `.env` files.
- **Robust Healthchecks:** Custom logic to ensure PostgreSQL is ready before the Django backend starts.
- **Security-First:** Runs as a non-root user within the container.
- **StatReloader:** Real-time code updates during development.

## 🚀 Quick Start (Local Setup)

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name
```

### 2. Configure environment variables
Create a `.env` file in the root directory based on the following template:
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
> The application will be accessible at `http://localhost:8000`.

## 👨‍💻 About Me
I am an ** AI enthusiast and Backend Developer** focused on building scalable systems and process automation.
- 🎓 **Academic Excellence:** Computer Science graduate with a GPA of 19.19/20.
- ⚡ **Interests:** AI Engineering, Workflow Automation (n8n), and Local LLM implementations.
- 🛠 **Core Skills:** Python (Django), Docker, PostgreSQL, and Machine Learning.

---
Developed with ❤️ by Moslem Amiri

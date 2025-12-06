# Event Planner - Phase 2 Docker Setup

## Overview
This project is now fully containerized with Docker. All services run in containers with persistent data volumes.

## Architecture
- **Frontend**: React + Vite served by Nginx (Port 80)
- **Backend**: Go API server (Port 8080)
- **Database**: MySQL 8.0 with persistent volume (Port 3306)

## Prerequisites
- Docker Desktop installed and running
- Docker Compose v2.0 or higher

## Quick Start

### 1. Build and Start All Services
```bash
docker-compose up -d --build
```

### 2. Check Services Status
```bash
docker-compose ps
```

### 3. View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

## Accessing the Application
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **Database**: localhost:3306

## Docker Commands

### Stop All Services
```bash
docker-compose down
```

### Stop and Remove Volumes (⚠️ Deletes all data)
```bash
docker-compose down -v
```

### Rebuild a Specific Service
```bash
docker-compose up -d --build backend
```

### Restart a Service
```bash
docker-compose restart backend
```

### View Container Logs
```bash
docker-compose logs -f [service-name]
```

### Execute Command in Container
```bash
# Backend
docker-compose exec backend sh

# Database
docker-compose exec db mysql -uroot -proot123 eventplanner
```

## Data Persistence
All data is stored in Docker volumes:
- `mysql_data`: Database data (persistent across restarts)

## Environment Variables
- Backend: Configured in `docker-compose.yml`
- Frontend: Set via `.env.production` (built into image)

## Troubleshooting

### Database Connection Issues
```bash
# Check if database is healthy
docker-compose ps

# View database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Backend Not Starting
```bash
# Check logs for errors
docker-compose logs backend

# Rebuild backend image
docker-compose up -d --build backend
```

### Port Conflicts
If ports 80, 8080, or 3306 are in use:
1. Stop services using those ports
2. Or modify ports in `docker-compose.yml`

## Development vs Production

### For Development (Local)
Continue using:
```bash
# Backend
cd Event-planner-backend
go run ./cmd/main.go

# Frontend
cd Event-planner-frontend
npm run dev
```

### For Production/Testing (Docker)
```bash
docker-compose up -d
```

## Network
All services communicate via the `eventplanner-network` bridge network. Containers can reach each other using service names (e.g., `backend`, `db`).

## Image Sizes
- Backend: ~15MB (Alpine-based)
- Frontend: ~25MB (Nginx Alpine)
- Database: ~500MB (MySQL official)

## Notes
- Database initialization scripts run automatically on first start
- Frontend is served via Nginx with optimized caching
- All services restart automatically unless stopped manually
- Data persists even when containers are removed (unless `-v` flag is used)

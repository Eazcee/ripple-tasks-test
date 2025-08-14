# Task Management Application

A full-stack task management application built with Angular frontend, .NET 8 Web API backend, and SQL Server database, all containerized with Docker.

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed and running
- Git

### One-Command Setup
```bash
# 1. Clone the repository
git clone <repository-url>
cd ripple-tasks-test

# 2. Start everything (database, backend, frontend)
docker-compose up -d

# 3. Access the application
# Frontend: http://localhost:4200
# Backend API: http://localhost:5113
```

**That's it!** The database is automatically created and the application is ready to use.

## 🏗️ Architecture

### Frontend (Angular)
- **Framework**: Angular 17
- **UI Library**: Angular Material
- **Features**: Task list, create/edit tasks, bulk operations, sorting/filtering
- **Port**: 4200

### Backend (.NET 8 Web API)
- **Framework**: ASP.NET Core 8
- **Database**: Entity Framework Core
- **Features**: RESTful API, CORS enabled, automatic database creation
- **Port**: 5113

### Database (SQL Server)
- **Database**: Microsoft SQL Server 2022
- **Features**: Persistent storage, automatic initialization
- **Port**: 1433

## 📁 Project Structure

```
ripple-tasks-test/
├── frontend/                 # Angular application
│   ├── Dockerfile           # Frontend container
│   └── nginx.conf           # Nginx configuration
├── backend/                  # .NET 8 Web API
│   ├── Dockerfile           # Backend container
│   ├── Controllers/         # API endpoints
│   ├── Models/              # Data models
│   └── Data/                # Entity Framework context
├── docker-compose.yml       # Container orchestration
└── README.md               # This file
```

## 🔧 Features

### Task Management
- ✅ Create, read, update, delete tasks
- ✅ Task details with inline editing
- ✅ Priority levels (High, Medium, Low)
- ✅ Status tracking (Pending, In Progress, Completed)
- ✅ Due date management

### Advanced Features
- ✅ Bulk operations (update status, shift dates)
- ✅ Sorting and filtering
- ✅ Search and pagination
- ✅ Responsive design

### Technical Features
- ✅ Automatic database creation
- ✅ Containerized deployment
- ✅ Health checks
- ✅ Persistent data storage
- ✅ API proxy through Nginx

## 🛠️ Development

### Making Changes
```bash
# Rebuild after code changes
docker-compose build backend    # For backend changes
docker-compose build frontend   # For frontend changes

# Restart services
docker-compose up -d backend
docker-compose up -d frontend
```

### Viewing Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f sqlserver
```

### Stopping Services
```bash
# Stop all services
docker-compose down

# Stop and remove data (WARNING: deletes database)
docker-compose down -v
```

## 🔍 Troubleshooting

### Database Issues
- The database is automatically created on first run
- Data persists between container restarts
- Check logs: `docker-compose logs backend`

### Frontend Not Loading
- Check if containers are running: `docker-compose ps`
- Rebuild frontend: `docker-compose build frontend`

### API Connection Issues
- Verify backend is running: `docker-compose logs backend`
- Test API: `curl http://localhost:5113/api/tasks`

## 📚 API Endpoints

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get specific task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PUT /api/tasks/bulk-update-status` - Bulk status update

## 🚀 Production Deployment

For production, consider:
1. Environment-specific configurations
2. SSL certificates
3. Production database (Azure SQL, AWS RDS)
4. Monitoring and logging
5. CI/CD pipelines

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

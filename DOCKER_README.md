# Task Management Application - Docker Setup

This project is now containerized using Docker Compose, which includes:
- **SQL Server Database** (Microsoft SQL Server 2022)
- **Backend API** (.NET 8 Web API)
- **Frontend Application** (Angular with Nginx)

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (usually included with Docker Desktop)

## Quick Start

1. **Start all services:**
   ```bash
   docker-compose up -d
   ```

2. **Access the application:**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:5113
   - SQL Server: localhost:1433

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

## Service Details

### SQL Server Database
- **Container**: `task-management-db`
- **Port**: 1433
- **Credentials**: 
  - Username: `sa`
  - Password: `Password123!`
- **Database**: `TaskDb` (created automatically)

### Backend API
- **Container**: `task-management-api`
- **Port**: 5113
- **Framework**: .NET 8
- **Database**: Automatically connects to SQL Server container

### Frontend Application
- **Container**: `task-management-frontend`
- **Port**: 4200
- **Framework**: Angular
- **Web Server**: Nginx
- **API Proxy**: Automatically routes `/api/*` requests to backend

## Database Initialization

The database will be automatically created when the backend starts. If you need to run migrations manually:

```bash
# Run migrations
docker-compose exec backend dotnet ef database update

# Create a new migration
docker-compose exec backend dotnet ef migrations add MigrationName
```

## Development Workflow

### Making Changes
1. Make your code changes
2. Rebuild the affected service:
   ```bash
   # Rebuild backend
   docker-compose build backend
   docker-compose up -d backend

   # Rebuild frontend
   docker-compose build frontend
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

## Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This will delete the database)
docker-compose down -v
```

## Troubleshooting

### Database Connection Issues
1. Check if SQL Server is running:
   ```bash
   docker-compose ps
   ```

2. Check SQL Server logs:
   ```bash
   docker-compose logs sqlserver
   ```

3. Test connection:
   ```bash
   docker-compose exec sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P Password123! -Q "SELECT 1"
   ```

### Frontend Not Loading
1. Check if the build was successful:
   ```bash
   docker-compose logs frontend
   ```

2. Rebuild the frontend:
   ```bash
   docker-compose build frontend
   docker-compose up -d frontend
   ```

### Backend API Issues
1. Check backend logs:
   ```bash
   docker-compose logs backend
   ```

2. Verify database connection:
   ```bash
   docker-compose exec backend dotnet ef database update
   ```

## Environment Variables

You can customize the setup by creating a `.env` file:

```env
# Database
SA_PASSWORD=YourCustomPassword
DB_PORT=1433

# Backend
BACKEND_PORT=5113
ASPNETCORE_ENVIRONMENT=Development

# Frontend
FRONTEND_PORT=4200
```

## Production Deployment

For production, consider:
1. Using environment-specific docker-compose files
2. Setting up proper SSL certificates
3. Using a production database (Azure SQL, AWS RDS, etc.)
4. Implementing proper logging and monitoring
5. Setting up CI/CD pipelines

## File Structure

```
├── docker-compose.yml          # Main orchestration file
├── backend/
│   └── Dockerfile             # Backend container definition
├── frontend/
│   ├── Dockerfile             # Frontend container definition
│   └── nginx.conf             # Nginx configuration
├── scripts/
│   └── init-database.sh       # Database initialization script
└── .dockerignore              # Files to exclude from Docker builds
``` 
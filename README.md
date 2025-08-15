# Task Management System

A full-stack task management application built with Angular 17 frontend and ASP.NET Core 8 backend, featuring comprehensive CRUD operations, real-time search, sorting, pagination, and bulk operations.

## 🚀 Features

### Frontend (Angular 17)
- **Task Management**: Create, read, update, and delete tasks
- **Advanced Filtering**: Search by title, filter by priority, status, and due dates
- **Sorting**: Sort by title, due date, priority, and status with custom priority sorting
- **Pagination**: Handle large datasets with configurable page sizes
- **Bulk Operations**: Select multiple tasks and update their status simultaneously
- **Real-time Search**: Instant filtering as you type
- **Responsive Design**: Works on desktop and mobile devices
- **Material Design**: Modern UI with Angular Material components

### Backend (ASP.NET Core 8)
- **RESTful API**: Complete CRUD operations for tasks
- **Entity Framework Core**: SQL Server database with automatic migrations
- **Advanced Queries**: Filter tasks by due dates, priority, and status
- **Bulk Operations**: Update multiple tasks efficiently using `ExecuteUpdateAsync`
- **CORS Support**: Configured for frontend communication
- **Swagger Documentation**: Interactive API documentation

## 📋 Prerequisites

- **.NET 8 SDK**
- **Node.js 18+** and **npm**
- **SQL Server** (or Docker for containerized setup)
- **Docker** (optional, for containerized development)

## 🛠️ Installation & Setup

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend/TaskManagement.Api
   ```

2. **Install dependencies:**
   ```bash
   dotnet restore
   ```

3. **Configure database connection:**
   - Update `appsettings.json` with your SQL Server connection string
   - For local development: `"Server=localhost,1433;Database=TaskDb;User Id=sa;Password=Password123!;TrustServerCertificate=True"`

4. **Run the application:**
   ```bash
   dotnet run
   ```
   - Backend will be available at: `http://localhost:5113`
   - Swagger documentation at: `http://localhost:5113/swagger`

### Frontend Setup

1. **Navigate to project root:**
   ```bash
   cd src
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm start
   ```
   - Frontend will be available at: `http://localhost:4200`

### Database Setup

The application uses Entity Framework Core with automatic database creation:

1. **Automatic Setup**: The database is automatically created on first run using `context.Database.EnsureCreated()`
2. **Manual Setup** (if needed):
   ```bash
   cd backend/TaskManagement.Api
   dotnet ef database update
   ```

## 🗄️ Database Schema

### TaskItem Table
```sql
CREATE TABLE TaskItems (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    DueDate DATETIME2 NOT NULL,
    Priority NVARCHAR(50) NOT NULL, -- 'Low', 'Medium', 'High'
    Status NVARCHAR(50) NOT NULL,   -- 'Pending', 'InProgress', 'Completed'
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
```

### Indexes
- Primary Key: `Id`
- Recommended indexes for performance:
  - `DueDate` for date-based queries
  - `Priority` for priority filtering
  - `Status` for status filtering

## 🔧 Environment Configuration

### Backend Configuration (`appsettings.json`)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=TaskDb;User Id=sa;Password=Password123!;TrustServerCertificate=True"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

### Frontend Configuration (`src/environments/environment.ts`)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5113/api'
};
```

## 📚 API Documentation

### Base URL
```
http://localhost:5113/api
```

### Endpoints

#### 1. Get All Tasks
```http
GET /tasks
```
**Response:**
```json
[
  {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive documentation for the task management system",
    "dueDate": "2024-01-15T00:00:00",
    "priority": "High",
    "status": "InProgress",
    "createdAt": "2024-01-10T10:00:00",
    "updatedAt": "2024-01-10T10:00:00"
  }
]
```

#### 2. Get Task by ID
```http
GET /tasks/{id}
```

#### 3. Create New Task
```http
POST /tasks
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description",
  "dueDate": "2024-01-20T00:00:00",
  "priority": "Medium",
  "status": "Pending"
}
```

#### 4. Update Task
```http
PUT /tasks/{id}
Content-Type: application/json

{
  "title": "Updated Task",
  "description": "Updated description",
  "dueDate": "2024-01-25T00:00:00",
  "priority": "High",
  "status": "InProgress"
}
```

#### 5. Delete Task
```http
DELETE /tasks/{id}
```

#### 6. Bulk Update Task Status
```http
PUT /tasks/bulk-update-status
Content-Type: application/json

{
  "taskIds": [1, 2, 3],
  "newStatus": "Completed"
}
```

### Advanced Queries

#### Filter Tasks by Date Range
```http
GET /tasks?startDate=2024-01-01&endDate=2024-01-31
```

#### Get Tasks by Priority
```http
GET /tasks?priority=High
```

#### Get Tasks by Status
```http
GET /tasks?status=Pending
```

## 🚀 Deployment

### Backend Deployment
1. **Build the application:**
   ```bash
   dotnet publish -c Release -o ./publish
   ```

2. **Deploy to your hosting platform** (Azure, AWS, etc.)

### Frontend Deployment
1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your web server

## 🐳 Docker Support

### Using Docker Compose
```bash
docker-compose up -d
```

This will start:
- SQL Server database
- Backend API
- Frontend application

### Individual Containers
```bash
# Backend
docker build -t task-management-api ./backend

# Frontend
docker build -t task-management-frontend ./frontend
```

## 🧪 Testing

### Backend Testing
```bash
cd backend/TaskManagement.Api
dotnet test
```

### Frontend Testing
```bash
npm test
```

## 📝 Development Workflow

1. **Start the backend:**
   ```bash
   cd backend/TaskManagement.Api
   dotnet run
   ```

2. **Start the frontend:**
   ```bash
   npm start
   ```

3. **Access the application:**
   - Frontend: `http://localhost:4200`
   - API Documentation: `http://localhost:5113/swagger`

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Error:**
   - Ensure SQL Server is running
   - Check connection string in `appsettings.json`
   - Verify firewall settings

2. **CORS Errors:**
   - Backend CORS is configured for `http://localhost:4200`
   - Update CORS policy if using different frontend URL

3. **Port Conflicts:**
   - Backend default: 5113
   - Frontend default: 4200
   - Update ports in configuration if needed

### Logs
- Backend logs are available in the console
- Frontend logs are available in browser developer tools

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation at `/swagger`
- Review the troubleshooting section
- Create an issue in the repository

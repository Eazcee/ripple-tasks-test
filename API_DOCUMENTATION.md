# Task Management API Documentation

## Overview

The Task Management API provides a comprehensive RESTful interface for managing tasks. Built with ASP.NET Core 8 and Entity Framework Core, it supports full CRUD operations, advanced filtering, and bulk operations.

**Base URL**: `http://localhost:5113/api`

**Content-Type**: `application/json`

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Data Models

### TaskItem

```json
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
```

### BulkUpdateRequest

```json
{
  "taskIds": [1, 2, 3],
  "newStatus": "Completed"
}
```

## Endpoints

### 1. Get All Tasks

Retrieves all tasks from the database.

```http
GET /tasks
```

**Query Parameters:**
- `priority` (optional): Filter by priority (`Low`, `Medium`, `High`)
- `status` (optional): Filter by status (`Pending`, `InProgress`, `Completed`)
- `startDate` (optional): Filter tasks due after this date (ISO 8601 format)
- `endDate` (optional): Filter tasks due before this date (ISO 8601 format)

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
  },
  {
    "id": 2,
    "title": "Review code changes",
    "description": "Review pull requests and provide feedback",
    "dueDate": "2024-01-12T00:00:00",
    "priority": "Medium",
    "status": "Pending",
    "createdAt": "2024-01-10T10:00:00",
    "updatedAt": "2024-01-10T10:00:00"
  }
]
```

**Example Requests:**
```bash
# Get all tasks
curl -X GET "http://localhost:5113/api/tasks"

# Get high priority tasks
curl -X GET "http://localhost:5113/api/tasks?priority=High"

# Get pending tasks
curl -X GET "http://localhost:5113/api/tasks?status=Pending"

# Get tasks due in date range
curl -X GET "http://localhost:5113/api/tasks?startDate=2024-01-01&endDate=2024-01-31"
```

### 2. Get Task by ID

Retrieves a specific task by its ID.

```http
GET /tasks/{id}
```

**Path Parameters:**
- `id` (integer): The unique identifier of the task

**Response:**
```json
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
```

**Error Responses:**
- `404 Not Found`: Task with the specified ID does not exist

**Example Request:**
```bash
curl -X GET "http://localhost:5113/api/tasks/1"
```

### 3. Create New Task

Creates a new task in the database.

```http
POST /tasks
```

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "dueDate": "2024-01-20T00:00:00",
  "priority": "Medium",
  "status": "Pending"
}
```

**Required Fields:**
- `title` (string): Task title (max 255 characters)
- `dueDate` (datetime): Task due date (ISO 8601 format)

**Optional Fields:**
- `description` (string): Task description
- `priority` (string): Task priority (`Low`, `Medium`, `High`) - defaults to `Medium`
- `status` (string): Task status (`Pending`, `InProgress`, `Completed`) - defaults to `Pending`

**Response:**
```json
{
  "id": 3,
  "title": "New Task",
  "description": "Task description",
  "dueDate": "2024-01-20T00:00:00",
  "priority": "Medium",
  "status": "Pending",
  "createdAt": "2024-01-10T10:00:00",
  "updatedAt": "2024-01-10T10:00:00"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request data or validation errors

**Example Request:**
```bash
curl -X POST "http://localhost:5113/api/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Task",
    "description": "Task description",
    "dueDate": "2024-01-20T00:00:00",
    "priority": "Medium",
    "status": "Pending"
  }'
```

### 4. Update Task

Updates an existing task by ID.

```http
PUT /tasks/{id}
```

**Path Parameters:**
- `id` (integer): The unique identifier of the task to update

**Request Body:**
```json
{
  "title": "Updated Task",
  "description": "Updated description",
  "dueDate": "2024-01-25T00:00:00",
  "priority": "High",
  "status": "InProgress"
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Updated Task",
  "description": "Updated description",
  "dueDate": "2024-01-25T00:00:00",
  "priority": "High",
  "status": "InProgress",
  "createdAt": "2024-01-10T10:00:00",
  "updatedAt": "2024-01-10T10:00:00"
}
```

**Error Responses:**
- `404 Not Found`: Task with the specified ID does not exist
- `400 Bad Request`: Invalid request data or validation errors

**Example Request:**
```bash
curl -X PUT "http://localhost:5113/api/tasks/1" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Task",
    "description": "Updated description",
    "dueDate": "2024-01-25T00:00:00",
    "priority": "High",
    "status": "InProgress"
  }'
```

### 5. Delete Task

Deletes a task by ID.

```http
DELETE /tasks/{id}
```

**Path Parameters:**
- `id` (integer): The unique identifier of the task to delete

**Response:**
- `204 No Content`: Task successfully deleted

**Error Responses:**
- `404 Not Found`: Task with the specified ID does not exist

**Example Request:**
```bash
curl -X DELETE "http://localhost:5113/api/tasks/1"
```

### 6. Bulk Update Task Status

Updates the status of multiple tasks in a single operation.

```http
PUT /tasks/bulk-update-status
```

**Request Body:**
```json
{
  "taskIds": [1, 2, 3],
  "newStatus": "Completed"
}
```

**Required Fields:**
- `taskIds` (array of integers): Array of task IDs to update
- `newStatus` (string): New status for all specified tasks (`Pending`, `InProgress`, `Completed`)

**Response:**
- `204 No Content`: Tasks successfully updated

**Error Responses:**
- `400 Bad Request`: Invalid request data or no task IDs provided
- `404 Not Found`: No tasks found with the provided IDs

**Example Request:**
```bash
curl -X PUT "http://localhost:5113/api/tasks/bulk-update-status" \
  -H "Content-Type: application/json" \
  -d '{
    "taskIds": [1, 2, 3],
    "newStatus": "Completed"
  }'
```

## Advanced Queries

### Filtering by Priority

```bash
# Get high priority tasks
curl -X GET "http://localhost:5113/api/tasks?priority=High"

# Get medium priority tasks
curl -X GET "http://localhost:5113/api/tasks?priority=Medium"

# Get low priority tasks
curl -X GET "http://localhost:5113/api/tasks?priority=Low"
```

### Filtering by Status

```bash
# Get pending tasks
curl -X GET "http://localhost:5113/api/tasks?status=Pending"

# Get in-progress tasks
curl -X GET "http://localhost:5113/api/tasks?status=InProgress"

# Get completed tasks
curl -X GET "http://localhost:5113/api/tasks?status=Completed"
```

### Filtering by Date Range

```bash
# Get tasks due in January 2024
curl -X GET "http://localhost:5113/api/tasks?startDate=2024-01-01&endDate=2024-01-31"

# Get tasks due after a specific date
curl -X GET "http://localhost:5113/api/tasks?startDate=2024-01-15"

# Get tasks due before a specific date
curl -X GET "http://localhost:5113/api/tasks?endDate=2024-01-15"
```

### Combining Filters

```bash
# Get high priority pending tasks
curl -X GET "http://localhost:5113/api/tasks?priority=High&status=Pending"

# Get medium priority tasks due in date range
curl -X GET "http://localhost:5113/api/tasks?priority=Medium&startDate=2024-01-01&endDate=2024-01-31"
```

## Error Handling

### Standard Error Response Format

```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Title": [
      "The Title field is required."
    ],
    "DueDate": [
      "The DueDate field is required."
    ]
  }
}
```

### Common HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `204 No Content`: Request successful, no content to return
- `400 Bad Request`: Invalid request data
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Rate Limiting

Currently, the API does not implement rate limiting. Consider implementing rate limiting for production use.

## CORS Configuration

The API is configured to allow requests from:
- `http://localhost:4200` (Angular development server)

For production, update the CORS policy in `Program.cs` to include your frontend domain.

## Swagger Documentation

Interactive API documentation is available at:
```
http://localhost:5113/swagger
```

This provides a web interface for testing all API endpoints directly from the browser.

## Testing the API

### Using curl

```bash
# Get all tasks
curl -X GET "http://localhost:5113/api/tasks"

# Create a new task
curl -X POST "http://localhost:5113/api/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "This is a test task",
    "dueDate": "2024-01-20T00:00:00",
    "priority": "High",
    "status": "Pending"
  }'

# Update a task
curl -X PUT "http://localhost:5113/api/tasks/1" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Test Task",
    "status": "Completed"
  }'

# Delete a task
curl -X DELETE "http://localhost:5113/api/tasks/1"
```

### Using Postman

1. Import the API endpoints into Postman
2. Set the base URL to `http://localhost:5113/api`
3. Use the provided examples for request bodies
4. Test all endpoints to ensure they work as expected

## Performance Considerations

1. **Database Indexing**: Ensure proper indexes on frequently queried fields
2. **Pagination**: For large datasets, implement pagination
3. **Caching**: Consider implementing caching for frequently accessed data
4. **Connection Pooling**: Entity Framework Core handles connection pooling automatically

## Security Considerations

1. **Input Validation**: All inputs are validated on the server side
2. **SQL Injection**: Entity Framework Core provides protection against SQL injection
3. **CORS**: Configure CORS properly for production
4. **Authentication**: Implement authentication for production use
5. **HTTPS**: Use HTTPS in production environments 
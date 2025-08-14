# Task Management System Frontend

This is a scaffolded Angular application for the Task Management System. It provides the basic structure and components needed to build a full-featured task management application.

## Prerequisites

- Node.js (v16 or later)
- Angular CLI (v17 or later)
- npm (v8 or later)

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   ng serve
   ```
4. Navigate to `http://localhost:4200` in your browser

## Project Structure

```
src/
├── app/
│   ├── components/         # Shared components
│   │   └── layout/        # Main layout component
│   ├── features/          # Feature modules
│   │   └── tasks/        # Tasks feature module
│   ├── models/           # Shared interfaces and models
│   └── services/         # Shared services
├── environments/         # Environment configurations
└── assets/             # Static assets
```

## Development Tasks

1. Create the following components in the tasks feature:
   - Task List View
   - Task Detail View
   - Task Form (Create/Edit)

2. Implement the task service to communicate with the API

3. Add form validation and error handling

4. Implement sorting and filtering in the task list

## Available Scripts

- `ng serve` - Start the development server
- `ng build` - Build the application for production
- `ng test` - Run unit tests
- `ng lint` - Run linting

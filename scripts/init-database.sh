#!/bin/bash

echo "Waiting for SQL Server to be ready..."
sleep 30

echo "Running database migrations..."
cd /src/TaskManagement.Api
dotnet ef database update

echo "Database initialization completed!" 
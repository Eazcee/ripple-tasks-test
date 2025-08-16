using Microsoft.EntityFrameworkCore;
using TaskManagement.Api.Data;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddCors(opt =>
    opt.AddPolicy("frontend", p => p
        .WithOrigins("http://localhost:4200")
        .AllowAnyHeader()
        .AllowAnyMethod()));

// Add Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "Task Management API", 
        Version = "v1",
        Description = "A comprehensive API for managing tasks with full CRUD operations, filtering, and bulk operations."
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Task Management API V1");
        c.RoutePrefix = "swagger";
    });
}
else
{
    // Enable Swagger in all environments for easier testing
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Task Management API V1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("frontend");
app.MapControllers();

// Configure listening URLs based on environment
if (builder.Environment.IsDevelopment())
{
    // Use launchSettings.json configuration for development
    // This will use port 5113 as defined in launchSettings.json
}
else
{
    // Ensure the app listens on port 80 for Docker
    app.Urls.Clear();
    app.Urls.Add("http://0.0.0.0:80");
}

// Initialize database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        // This will create the database if it doesn't exist
        context.Database.EnsureCreated();
        Console.WriteLine("Database initialized successfully!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error initializing database: {ex.Message}");
    }
}

app.Run();

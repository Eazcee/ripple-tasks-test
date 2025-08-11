namespace TaskManagement.Api.Models;

// Represents a task in the task management system
public class TaskItem
{
    // Unique identifier for the task
    public int Id { get; set; }
    
    // Title/name of the task
    public string Title { get; set; } = string.Empty;
    
    // Optional detailed description of the task
    public string? Description { get; set; }
    
    // When the task is due to be completed
    public DateTime DueDate { get; set; }
    
    // Priority level: Low, Medium, or High (defaults to Medium)
    public string Priority { get; set; } = "Medium"; // Low | Medium | High
    
    // Current status of the task (defaults to Pending)
    public string Status { get; set; } = "Pending"; // Pending | InProgress | Completed
    
    // When the task was first created
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // When the task was last modified
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}



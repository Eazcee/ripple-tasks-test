namespace TaskManagement.Api.Models;

public class TaskItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime DueDate { get; set; }
    public string Priority { get; set; } = "Medium"; // Low | Medium | High
    public string Status { get; set; } = "Pending"; // Pending | InProgress | Completed
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}



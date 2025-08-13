using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Api.Data;
using TaskManagement.Api.Models;

namespace TaskManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController(AppDbContext db) : ControllerBase
{
    // Get all tasks from the database
    [HttpGet]
    public Task<List<TaskItem>> Get() => db.Tasks.AsNoTracking().ToListAsync();

    // Get a specific task by its ID
    [HttpGet("{id:int}")]
    public async Task<ActionResult<TaskItem>> Get(int id)
        => await db.Tasks.FindAsync(id) is { } item ? item : NotFound();

    // Create a new task
    [HttpPost]
    public async Task<ActionResult<TaskItem>> Post(TaskItem item)
    {
        db.Tasks.Add(item);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = item.Id }, item);
    }

    // Update an existing task
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Put(int id, TaskItem update)
    {
        if (id != update.Id) return BadRequest();
        db.Entry(update).State = EntityState.Modified;
        await db.SaveChangesAsync();
        return NoContent();
    }

    // Delete a task by its ID
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await db.Tasks.FindAsync(id);
        if (item is null) return NotFound();
        db.Tasks.Remove(item);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // TASK 6 - IMPLEMENTED FEATURES
    
    // Get tasks due within the next 7 days
    [HttpGet("due-next-7-days")]
    public async Task<ActionResult<List<TaskItem>>> GetTasksDueInNext7Days()
    {
        var sevenDaysFromNow = DateTime.UtcNow.AddDays(7);
        var tasks = await db.Tasks
            .Where(t => t.DueDate >= DateTime.UtcNow && t.DueDate <= sevenDaysFromNow)
            .AsNoTracking()
            .ToListAsync();
        
        return Ok(tasks);
    }
    
    // Get count of tasks grouped by priority level
    [HttpGet("count-by-priority")]
    public async Task<ActionResult<object>> GetTaskCountByPriority()
    {
        var priorityCounts = await db.Tasks
            .GroupBy(t => t.Priority)
            .Select(g => new { Priority = g.Key, Count = g.Count() })
            .OrderBy(x => x.Priority)
            .ToListAsync();
        
        return Ok(priorityCounts);
    }
    
    // Find all overdue tasks that aren't completed
    [HttpGet("overdue")]
    public async Task<ActionResult<List<TaskItem>>> GetOverdueTasks()
    {
        var overdueTasks = await db.Tasks
            .Where(t => t.DueDate < DateTime.UtcNow && t.Status != "Completed")
            .AsNoTracking()
            .ToListAsync();
        
        return Ok(overdueTasks);
    }
    
    // Update status of multiple tasks at once
    [HttpPut("bulk-update-status")]
    public async Task<IActionResult> BulkUpdateTaskStatus([FromBody] BulkUpdateRequest request)
    {
        if (request.TaskIds == null || !request.TaskIds.Any())
            return BadRequest("Task IDs are required");

        var affected = await db.Tasks
            .Where(t => request.TaskIds.Contains(t.Id))
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(t => t.Status, _ => request.NewStatus)
                .SetProperty(t => t.UpdatedAt, _ => DateTime.UtcNow));

        if (affected == 0) return NotFound("No tasks found with the provided IDs");
        return NoContent();
    }
    
    // Helper class for bulk update request
    public class BulkUpdateRequest
    {
        public List<int> TaskIds { get; set; } = new();
        public string NewStatus { get; set; } = string.Empty;
    }
    
    
    // Tasks to do later:
    //  Mark all overdue tasks as InProgress:
    //    UPDATE Tasks 
    //    SET Status = 'InProgress', UpdatedAt = GETUTCDATE() 
    //    WHERE DueDate < GETUTCDATE() 
    //      AND Status <> 'Completed';
}



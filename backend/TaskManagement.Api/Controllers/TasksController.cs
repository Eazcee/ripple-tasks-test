using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Api.Data;
using TaskManagement.Api.Models;

namespace TaskManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public Task<List<TaskItem>> Get() => db.Tasks.AsNoTracking().ToListAsync();

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TaskItem>> Get(int id)
        => await db.Tasks.FindAsync(id) is { } item ? item : NotFound();

    [HttpPost]
    public async Task<ActionResult<TaskItem>> Post(TaskItem item)
    {
        db.Tasks.Add(item);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = item.Id }, item);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Put(int id, TaskItem update)
    {
        if (id != update.Id) return BadRequest();
        db.Entry(update).State = EntityState.Modified;
        await db.SaveChangesAsync();
        return NoContent();
    }

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
    
    // 1. Retrieve tasks due within the next 7 days
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
    
    // 2. Get a count of tasks by priority level
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
    
    // 3. Find tasks that are overdue
    [HttpGet("overdue")]
    public async Task<ActionResult<List<TaskItem>>> GetOverdueTasks()
    {
        var overdueTasks = await db.Tasks
            .Where(t => t.DueDate < DateTime.UtcNow && t.Status != "Completed")
            .AsNoTracking()
            .ToListAsync();
        
        return Ok(overdueTasks);
    }
    
    // 4. Update multiple tasks' status in a single query
    [HttpPut("bulk-update-status")]
    public async Task<IActionResult> BulkUpdateTaskStatus([FromBody] BulkUpdateRequest request)
    {
        if (request.TaskIds == null || !request.TaskIds.Any())
            return BadRequest("Task IDs are required");
        
        var tasksToUpdate = await db.Tasks
            .Where(t => request.TaskIds.Contains(t.Id))
            .ToListAsync();
        
        if (!tasksToUpdate.Any())
            return NotFound("No tasks found with the provided IDs");
        
        foreach (var task in tasksToUpdate)
        {
            task.Status = request.NewStatus;
            task.UpdatedAt = DateTime.UtcNow;
        }
        
        await db.SaveChangesAsync();
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



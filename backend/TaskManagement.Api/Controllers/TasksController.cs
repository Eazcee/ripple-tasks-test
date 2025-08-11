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
}



using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChatApp.Web.Models;
using Microsoft.AspNetCore.SignalR;
using ChatApp.Web.Hubs;

namespace MyApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
  private readonly DatabaseContext _context;
  private readonly IHubContext<GameHub> _hubContext;

  public UsersController(DatabaseContext context, IHubContext<GameHub> hubContext)
  {
    _context = context;
    _hubContext = hubContext;
  }

  [HttpGet]
  public async Task<ActionResult<IEnumerable<User>>> GetUsernames()
  {
    return await _context.Users.ToListAsync();
  }

  [HttpPost]
  public async Task<ActionResult<User>> PostUsername(User User)
  {
    _context.Users.Add(User);
    await _context.SaveChangesAsync();

    await _hubContext.Clients.All.SendAsync("ReceiveMessage", User);

    return CreatedAtAction(nameof(GetUsernames), new { id = User.Id }, User);
  }
}
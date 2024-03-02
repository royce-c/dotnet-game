using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ChatApp.Web.Models;
using Microsoft.AspNetCore.SignalR;
using ChatApp.Web.Hubs;

namespace MyApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BoardController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly IHubContext<BoardHub> _hubContext;

        public BoardController(DatabaseContext context, IHubContext<BoardHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<IEnumerable<int?>>>> GetBoard()
        {
            var tiles = await _context.Tiles.ToListAsync();
            var boardList = new List<List<int?>>();

            for (int i = 0; i < 3; i++)
            {
                var row = new List<int?>();
                for (int j = 0; j < 3; j++)
                {
                    var tile = tiles.FirstOrDefault(t => t.Row == i && t.Column == j);
                    if (tile != null)
                    {
                        row.Add(tile.Value);
                    }
                    else
                    {
                        row.Add(null);
                    }
                }
                boardList.Add(row);
            }

            return Ok(boardList);
        }

        [HttpPost]
        public async Task<ActionResult> SetTile([FromQuery] int row, [FromQuery] int column, [FromQuery] int value)
        {
            if (row < 0 || row >= 3 || column < 0 || column >= 3)
            {
                return BadRequest("Invalid row or column value.");
            }

            if (value < 0 || value > 2)
            {
                return BadRequest("Invalid tile value.");
            }

            var existingTile = await _context.Tiles.FirstOrDefaultAsync(t => t.Row == row && t.Column == column);

            if (existingTile != null)
            {
                existingTile.Value = value;
            }
            else
            {
                _context.Tiles.Add(new Tile { Row = row, Column = column, Value = value });
            }

            await _context.SaveChangesAsync();
            await _hubContext.Clients.All.SendAsync("UpdateTile", row, column, value);

            return Ok();
        }
    }
}

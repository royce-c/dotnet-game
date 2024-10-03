// BoardResetService.cs
using Microsoft.Extensions.Hosting;
using ChatApp.Web.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ChatApp.Web.Services
{
    public class BoardResetService : IHostedService, IDisposable
    {
        private readonly IServiceProvider _serviceProvider;
        private Timer _timer;

        public BoardResetService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _timer = new Timer(ResetBoard, null, TimeSpan.Zero, TimeSpan.FromMinutes(60)); // Executes every x minutes
            return Task.CompletedTask;
        }

        private async void ResetBoard(object state)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<DatabaseContext>();

                // Reset all tiles
                var tiles = await context.Tiles.ToListAsync();
                foreach (var tile in tiles)
                {
                    tile.Value = 1; // Reset the value of each tile
                }

                // Delete all users
                var users = await context.Users.ToListAsync();
                context.Users.RemoveRange(users);

                await context.SaveChangesAsync();
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}

using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MyApp.Services;

namespace MyApp.Services
{
    public class TileResetService : IHostedService, IDisposable
    {
        private readonly ILogger<TileResetService> _logger;
        private Timer _timer;
        private DateTime _lastUpdateTime;
        private readonly TimeSpan _resetDelay = TimeSpan.FromSeconds(30);

        public TileResetService(ILogger<TileResetService> logger)
        {
            _logger = logger;
            _lastUpdateTime = DateTime.Now;
        }

        public void UpdateLastUpdateTime()
        {
            _lastUpdateTime = DateTime.Now;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _timer = new Timer(CheckForReset, null, TimeSpan.Zero, TimeSpan.FromSeconds(1));
            return Task.CompletedTask;
        }

        private void CheckForReset(object state)
        {
            if (DateTime.Now - _lastUpdateTime >= _resetDelay)
            {
                ResetBoard();
                _lastUpdateTime = DateTime.Now; // Reset the timer
            }
        }

        private void ResetBoard()
        {
            // Logic to reset the board
            _logger.LogInformation("Resetting the board due to inactivity.");
            // Here you would typically call a method to reset the database tiles or notify clients
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

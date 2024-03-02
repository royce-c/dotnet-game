namespace ChatApp.Web.Hubs;
using Microsoft.AspNetCore.SignalR;

public class GameHub : Hub
{
    public override Task OnConnectedAsync()
    {
        // Console.WriteLine("A Client Connected: " + Context.ConnectionId);
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception exception)
    {
        // Console.WriteLine("A client disconnected: " + Context.ConnectionId);
        return base.OnDisconnectedAsync(exception);
    }

}
    // public async Task SendBoardState(int?[,] board)
    // {
    //     await Clients.All.SendAsync("ReceiveBoardState", board);
    // }

    // public async Task UpdateTile(int row, int column, int value)
    // {
    //     await Clients.All.SendAsync("UpdateTile", row, column, value);
    // }

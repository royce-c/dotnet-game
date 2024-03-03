using ChatApp.Web.Models;
using ChatApp.Web.Hubs;
using Microsoft.EntityFrameworkCore;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

var connectionString = Environment.GetEnvironmentVariable("DATABASE_CONNECTION_STRING");

builder.Services.AddDbContext<DatabaseContext>(
    opt =>
    {
      opt.UseNpgsql(connectionString);
      if (builder.Environment.IsDevelopment())
      {
        opt
          .LogTo(Console.WriteLine, LogLevel.Information)
          .EnableSensitiveDataLogging()
          .EnableDetailedErrors();
      }
    }
);

builder.Services.AddControllers();

builder.Services.AddSignalR();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.MapControllers();
app.MapHub<GameHub>("/r/gameHub");

app.MapGet("/test", () => "Hello World!");

app.UseDefaultFiles();
app.UseStaticFiles();
app.MapFallbackToFile("index.html");

app.Run();

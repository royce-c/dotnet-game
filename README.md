# Real Time Pixel Art Maker

## Description

Real Time Pixel Art Maker is a web application that allows multiple users to collaboratively create pixel art in real-time. Utilizing Web Sockets via SignalR, the application facilitates seamless communication between users, providing an interactive and shared canvas.

## Features

Real-time collaborative pixel art creation
Multiple users can edit the canvas simultaneously
Responsive interface for desktop and mobile devices
Backend communication powered by SignalR

## Tech Stack

Frontend: React, Vite
Backend: C#, .NET, SignalR
Database: PostgreSQL
Real-Time Communication: SignalR

## Installation

Prerequisites:

- .NET SDK
- Node.js (for Vite/React)
- PostgreSQL

### Steps

Clone the repository:

```bash
git clone https://github.com/royce-c/dotnet-game.git
cd dotnet-game
```

Setup the backend:

Restore the .NET project dependencies and create a .env file:

```bash
cd DrawApp.Web
dotnet restore
touch .env
```

Add database connection string to the .env file:

```env
DATABASE_CONNECTION_STRING=
```

Run the backend:

```bash
dotnet run
```

Visit `http://127.0.0.1:5227` to view the application.

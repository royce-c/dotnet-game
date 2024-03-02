// import { useEffect, useState } from "react";
import useSignalR from "./useSignalR";

export default function App() {
  const { connection } = useSignalR("/r/boardHub");

  return (
    <div className="App">
      <h1>SignalR Chat</h1>
      <p>{connection ? "Connected" : "Not connected"}</p>
    </div>
  );
}
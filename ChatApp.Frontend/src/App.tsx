import React, { useEffect, useState } from "react";
import useSignalR from "./useSignalR";
import Board from "./components/ui/board";

export default function App() {
  const [tiles, setTiles] = useState<number[][]>(
    Array(3).fill(Array(3).fill(null))
  );
  const { connection } = useSignalR("/r/gameHub");

  useEffect(() => {
    // Initial fetch for initial state
    fetchLayout();
  }, []);

  useEffect(() => {
    if (connection) {
      // Event listener for updates from server
      connection.on("UpdateTile", (row: number, column: number, value: number) => {
        setTiles((prevTiles) => {
          const newTiles = [...prevTiles];
          newTiles[row][column] = value;
          return newTiles;
        });
      });
    }

    // Cleanup for preventing memory leaks
    return () => {
      if (connection) {
        connection.off("UpdateTile");
      }
    };
  }, [connection]);

  const handleClick = async (row: number, column: number) => {
    try {
      // Update local state immediately
      const tileValue = tiles[row][column];
      const newValue = tileValue === null ? 0 : (tileValue + 1) % 3;
      setTiles((prevTiles) => {
        const newTiles = [...prevTiles];
        newTiles[row][column] = newValue;
        return newTiles;
      });

      // Notify server with the updated value
      const response = await fetch(`/api/board?row=${row}&column=${column}&value=${newValue}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          row,
          column,
          value: newValue
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state based on the response
      const updatedTiles = await response.json();
      setTiles(updatedTiles);
    } catch (error) {
      console.error("Error updating tile:", error);
      // Handle error gracefully
    }
  };

  async function fetchLayout() {
    try {
      const response = await fetch("/api/board");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const tiles = await response.json();
      setTiles(tiles);
    } catch (error) {
      console.error("Error fetching board layout:", error);
      // Handle error gracefully
    }
  }

  return (
    <div className="App">
      <h1>3x3 Board</h1>
      <p>{connection ? "Connected" : "Not connected"}</p>
      <Board tiles={tiles} onClick={handleClick} />
    </div>
  );
}

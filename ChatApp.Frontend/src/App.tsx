import { useEffect, useState } from "react";
import useSignalR from "./useSignalR";
import Board from "./components/ui/board";
import handleClick from "./handleClick";
import fetchLayout from "./fetchLayout";

export default function App() {
  const [tiles, setTiles] = useState<number[][]>(
    Array(3).fill(Array(3).fill(null))
  );
  const { connection } = useSignalR("/r/gameHub");

  useEffect(() => {
    // Initial fetch for initial state
    fetchLayout().then(setTiles);
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

  const handleClickWrapper = async (row: number, column: number) => {
    try {
      const updatedTiles = await handleClick(row, column, tiles);
      setTiles(updatedTiles);
    } catch (error) {
      console.error("Error updating tile:", error);
      // Handle error gracefully
    }
  };

  return (
    <div className="App">
      <h1>3x3 Board</h1>
      <p>{connection ? "Connected" : "Not connected"}</p>
      <Board tiles={tiles} onClick={handleClickWrapper} />
    </div>
  );
}

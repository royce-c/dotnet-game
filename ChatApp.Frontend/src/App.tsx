import React, { useEffect, useState } from "react";
import useSignalR from "./useSignalR";

export default function App() {
  const { connection } = useSignalR("/r/boardHub");
  const [tiles, setTiles] = useState<number[][]>([]);

  useEffect(() => {
    async function fetchLayout() {
      const result = await fetch("/api/board");
      const tiles = await result.json();
      setTiles(tiles);
    }

    fetchLayout();

    if (connection) {
      connection.on("UpdateTile", (row: number, column: number, value: number) => {
        const newTiles = [...tiles];
        newTiles[row][column] = value;
        setTiles(newTiles);
      });
    }

    return () => {
      if (connection) {
        connection.off("UpdateTile");
      }
    };
  }, [connection, tiles]);

  const changeTile = async (row: number, column: number, value: number) => {
    const response = await fetch("/api/board", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        row: row,
        column: column,
        value: value
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  };

  const handleClick = async (row: number, column: number) => {
    const tileValue = tiles[row][column];
    const newValue = tileValue === null ? 0 : (tileValue + 1) % 3;
    const newTiles = [...tiles];
    newTiles[row][column] = newValue;
    setTiles(newTiles);
    await changeTile(row, column, newValue);
  };

  return (
    <div className="App">
      <h1>3x3 Board</h1>
      <p>{connection ? "Connected" : "Not connected"}</p>
      <table>
        <tbody>
          {tiles.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((value, columnIndex) => (
                <td
                  key={columnIndex}
                  onClick={() => handleClick(rowIndex, columnIndex)}
                  style={{
                    cursor: "pointer",
                    width: 50,
                    height: 50,
                    border: "1px solid black",
                    textAlign: "center",
                  }}
                >
                  {value !== null ? value : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

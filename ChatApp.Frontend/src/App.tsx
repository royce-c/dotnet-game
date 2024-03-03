import React, { useEffect, useState } from "react";
import useSignalR from "./useSignalR";
import Board from "./components/ui/board";
import handleClick from "./handleClick";
import fetchLayout from "./fetchLayout";
import UserList from "./components/ui/UserList";
import UsernameForm from "./components/ui/UsernameForm";

export default function App() {
  const [tiles, setTiles] = useState<number[][]>(
    Array(10).fill(Array(10).fill(null))
  );
  const { connection } = useSignalR("/r/gameHub");
  const [usernames, setUsernames] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    // Initial fetch for initial state
    fetchLayout().then(setTiles);

    fetch("/api/Users/usernames")
      .then((response) => response.json())
      .then((data) => setUsernames(data))
      .catch((error) =>
        console.error("Error fetching usernames:", error)
      );

    if (connection) {
      // Event listener for updates from server
      connection.on("UpdateTile", (row: number, column: number, value: number) => {
        setTiles((prevTiles) => {
          const newTiles = [...prevTiles];
          newTiles[row][column] = value;
          return newTiles;
        });
      });

      // Event listener for new usernames
      connection.on("ReceiveMessage", (newUsername: string) => {
        setUsernames((prevUsernames) => [...prevUsernames, newUsername]);
      });

      // Event listener for receiving all usernames on connect
      connection.on("ReceiveUsernames", (allUsernames: string[]) => {
        setUsernames(allUsernames);
      });
    }

    // Cleanup for preventing memory leaks
    return () => {
      if (connection) {
        connection.off("UpdateTile");
        connection.off("ReceiveMessage");
        connection.off("ReceiveUsernames");
      }
    };
  }, [connection]);

  const handleUsernameSubmit = async (username: string) => {
    try {
      await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });
      setShowForm(false); // Hide the form after username is set
    } catch (error) {
      console.error("Error creating username:", error);
      // Handle error gracefully
    }
  };

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
      <h1>Pixel Art Maker</h1>
      <p>{connection ? "Connected" : "Not connected"}</p>
      {showForm && <UsernameForm onSubmit={handleUsernameSubmit} />}
      <UserList usernames={usernames} />
      <Board tiles={tiles} onClick={handleClickWrapper} />
    </div>
  );
}

import { useEffect, useState } from "react";
import useSignalR from "./useSignalR";
import Board from "./components/ui/board";
import handleClick from "./handleClick";
import fetchLayout from "./fetchLayout";

export default function App() {
  const [tiles, setTiles] = useState<number[][]>(
    Array(10).fill(Array(10).fill(null))
  );  
  const { connection } = useSignalR("/r/gameHub");
  const [username, setUsername] = useState("");
  const [usernames, setUsernames] = useState<string[]>([]);

  useEffect(() => {
    // Initial fetch for initial state
    fetchLayout().then(setTiles);

    fetch("/api/Users/usernames")
    .then((response) => response.json())
    .then((data) => setUsernames(data))
    .catch((error) => console.error("Error fetching usernames:", error));


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

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleUsernameSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });
      setUsername("");
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
      <h1>Pixel Board</h1>
      <p>{connection ? "Connected" : "Not connected"}</p>
      <form onSubmit={handleUsernameSubmit}>
        <input
          type="text"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Enter username"
        />
        <button type="submit">Set Username</button>
      </form>
      <h2>Users:</h2>
      <ul>
        {usernames.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <Board tiles={tiles} onClick={handleClickWrapper} />
    </div>
  );
}

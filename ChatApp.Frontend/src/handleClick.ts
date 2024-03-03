export default async function handleClick(row: number, column: number, tiles: number[][]) {
    // Update local state immediately
    const tileValue = tiles[row][column];
    const newValue = tileValue === null ? 0 : (tileValue + 1) % 3;
    const newTiles = [...tiles];
    newTiles[row][column] = newValue;
  
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
    return updatedTiles;
  }

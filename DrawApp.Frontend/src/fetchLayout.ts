export default async function fetchLayout() {
    const response = await fetch("/api/board");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const tiles = await response.json();
    return tiles;
  }
  
import React from "react";

interface BoardProps {
  tiles: number[][];
  onClick: (row: number, column: number) => void;
}

const Board: React.FC<BoardProps> = ({ tiles, onClick }) => {
  return (
    <table>
      <tbody>
        {tiles.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((value, columnIndex) => (
              <td
                key={columnIndex}
                onClick={() => onClick(rowIndex, columnIndex)}
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
  );
};

export default Board;

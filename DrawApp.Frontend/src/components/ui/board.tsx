import React from "react";

interface BoardProps {
  tiles: number[][];
  onClick: (row: number, column: number) => void;
}

const Board: React.FC<BoardProps> = ({ tiles, onClick }) => {
  return (
<div className="p-4">
  <table style={{ borderCollapse: "collapse" }}>
    <tbody>
      {tiles.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {row.map((value, columnIndex) => (
                        <td
              key={columnIndex}
              onClick={() => onClick(rowIndex, columnIndex)}
              className="border-fade cursor-pointer w-10 h-10 text-center"
              style={{
                backgroundColor: value === 0 ? "black" : value === 1 ? "white" : "transparent",
                color: value === 0 ? "white" : "black",
              }}
            >
              {/* {value === 0 ? "X" : value === 1 ? "O" : ""} */}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
};

export default Board;

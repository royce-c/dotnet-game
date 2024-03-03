import React from "react";

interface BoardProps {
  tiles: number[][];
  onClick: (row: number, column: number) => void;
}

const Board: React.FC<BoardProps> = ({ tiles, onClick }) => {
  return (
    <div className="p-4">
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
                    backgroundColor:
                      value === 0
                        ? "black"
                        : value === 1
                        ? "white"
                        : "transparent",
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

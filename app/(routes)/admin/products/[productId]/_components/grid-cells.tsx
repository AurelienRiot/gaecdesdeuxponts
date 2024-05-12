"use client";
import { useState } from "react";

const GridCells = ({
  handleCellClick,
  size = 5,
}: {
  handleCellClick: (rowIndex: number, colIndex: number) => void;
  size?: number;
}) => {
  const [grid, setGrid] = useState(
    Array.from({ length: size }, () => Array.from({ length: size }, () => 0)),
  );

  const handleOnMouseOver = (rowIndex: number, colIndex: number) => {
    // Toggle the value (0 or 1) when a cell is clicked
    const newGrid = grid.map((row, rowIdx) =>
      row.map((cellValue, colIdx) =>
        rowIdx <= rowIndex && colIdx <= colIndex ? 1 : 0,
      ),
    );
    setGrid(newGrid);
  };

  return (
    <div
      style={{ width: 16.5 * size }}
      className="flex  flex-row flex-wrap items-center gap-[0.5px] self-center"
    >
      {grid.map((row, rowIndex) =>
        row.map((cellValue, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`h-4 w-4 cursor-pointer rounded-md  border-2 border-border transition-colors  ${
              cellValue === 1 ? "bg-foreground" : "bg-background"
            }`}
            onClick={() => handleCellClick(rowIndex + 1, colIndex + 1)}
            onMouseOver={() => handleOnMouseOver(rowIndex, colIndex)}
          ></div>
        )),
      )}
    </div>
  );
};

export default GridCells;

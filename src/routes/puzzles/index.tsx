import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/puzzles/")({
  component: RouteComponent,
});

const createGrid = (numRows: number = 10): number[][] => {
  let rows = [];
  for (let i = numRows; i > 0; i--) {
    const rowElements = [];
    for (let j = 0; j < i; j++) {
      rowElements.push(-1);
    }
    rows.unshift(rowElements);
  }
  return rows;
};

const PUZZLE_PIECES = [
  {
    color: "bg-cyan-300",
    shape: [
      [-1, 0],
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ],
  },
  {
    color: "bg-green-300",
    shape: [
      [-1, 0],
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
    ],
  },
  {
    color: "bg-zinc-600",
    shape: [
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
    ],
  },
  {
    color: "bg-orange-500",
    shape: [
      [0, 0],
      [1, 0],
      [1, 1],
      [-0, -1],
      [-1, -1],
    ],
  },
  {
    color: "bg-slate-200",
    shape: [
      [0, 0],
      [1, 0],
      [2, 0],
      [-1, 0],
      [-1, 1],
    ],
  },
  {
    color: "bg-purple-700",
    shape: [
      [0, 0],
      [-1, 0],
      [-2, 0],
      [0, -1],
      [1, -1],
    ],
  },
  {
    color: "bg-green-800",
    shape: [
      [0, 0],
      [-1, 0],
      [-2, 0],
      [1, 0],
    ],
  },
  {
    color: "bg-yellow-300",
    shape: [
      [0, 0],
      [-1, 0],
      [0, 1],
      [-1, 1],
    ],
  },
  {
    color: "bg-red-600",
    shape: [
      [0, 0],
      [-1, 0],
      [1, 0],
      [0, 1],
      [0, -1],
    ],
  },
  {
    color: "bg-rose-300",
    shape: [
      [0, 0],
      [-1, 0],
      [0, 1],
    ],
  },
  {
    color: "bg-blue-700",
    shape: [
      [0, 0],
      [-1, 0],
      [-2, 0],
      [0, 1],
      [0, 2],
    ],
  },
  {
    color: "bg-gray-800",
    shape: [
      [0, 0],
      [-1, 0],
      [1, 0],
      [1, 1],
      [-1, 1],
    ],
  },
];

function RouteComponent() {
  const [grid, setGrid] = useState<number[][]>(createGrid());
  const [selectedPiece, setSelectedPiece] = useState<number>(
    PUZZLE_PIECES.length - 1,
  );
  const [hoveredCell, setHoveredCell] = useState<number[] | null>(null);
  const [rotationCounter, setRotationCounter] = useState<number>(0);
  const [pieces, setPieces] = useState<typeof PUZZLE_PIECES>([
    ...PUZZLE_PIECES,
  ]);

  useEffect(() => {
    const handleRotateKey = (event: KeyboardEvent) => {
      if (event.key === "r") {
        rotateSelectedPiece();
      }
    };
    const handleFlipKey = (event: KeyboardEvent) => {
      if (event.key === "f") {
        flipXSelectedPiece();
      }
    };
    const handleFlipYKey = (event: KeyboardEvent) => {
      if (event.key === "g") {
        flipYSelectedPiece();
      }
    };

    window.addEventListener("keydown", handleRotateKey);
    window.addEventListener("keydown", handleFlipKey);
    window.addEventListener("keydown", handleFlipYKey);

    // Clean up
    return () => {
      window.removeEventListener("keydown", handleRotateKey);
      window.removeEventListener("keydown", handleFlipKey);
      window.removeEventListener("keydown", handleFlipYKey);
    };
  }, [selectedPiece, rotationCounter]);

  const rotateSelectedPiece = () => {
    const newPieces = [...pieces];
    newPieces[selectedPiece] = {
      ...newPieces[selectedPiece],
      shape: (newPieces[selectedPiece].shape).map(([row, col]) => [col, -row]),
    };

    setPieces(newPieces);
    setRotationCounter((prev) => prev + 1);
  };

  const flipXSelectedPiece = () => {
    const newPieces = [...pieces];
    newPieces[selectedPiece] = {
      ...newPieces[selectedPiece],
      shape: (newPieces[selectedPiece].shape).map(([row, col]) => [-row, col]),
    };

    setPieces(newPieces);
    setRotationCounter((prev) => prev + 1);
  };

  const flipYSelectedPiece = () => {
    const newPieces = [...pieces];
    newPieces[selectedPiece] = {
      ...newPieces[selectedPiece],
      shape: (newPieces[selectedPiece].shape).map(([row, col]) => [row, -col]),
    };

    setPieces(newPieces);
    setRotationCounter((prev) => prev + 1);
  };

  // Check if a piece can be placed at a given position
  const canPlacePiece = (
    rowIndex: number,
    colIndex: number,
    pieceIndex: number,
  ) => {
    const piece = pieces[pieceIndex];

    for (const [relRow, relCol] of piece.shape) {
      const newRow = rowIndex + relRow;
      const newCol = colIndex + relCol;

      // Check if the cell is within grid bounds
      if (
        newRow < 0 ||
        newRow >= grid.length ||
        newCol < 0 ||
        newCol >= grid[newRow].length
      ) {
        return false;
      }

      // Check if the cell is already filled
      if (grid[newRow][newCol] !== -1) {
        return false;
      }
    }

    return true;
  };

  const getPreviewPieceCells = (
    rowIndex: number,
    colIndex: number,
  ): string[] => {
    if (!canPlacePiece(rowIndex, colIndex, selectedPiece)) return [];

    const previewCells = [];
    const piece = pieces[selectedPiece];

    for (const [relRow, relCol] of piece.shape) {
      const newRow = rowIndex + relRow;
      const newCol = colIndex + relCol;

      previewCells.push(`${newRow}-${newCol}`);
    }

    return previewCells;
  };

  // Place a piece on the grid
  const placePiece = (
    rowIndex: number,
    colIndex: number,
    puzzleIndex: number,
  ) => {
    if (!canPlacePiece(rowIndex, colIndex, selectedPiece)) return;

    const newGrid = grid.map((row) => [...row]);
    const piece = pieces[selectedPiece];

    for (const [relRow, relCol] of piece.shape) {
      const newRow = rowIndex + relRow;
      const newCol = colIndex + relCol;
      newGrid[newRow][newCol] = puzzleIndex;
    }

    setGrid(newGrid);
  };

  const renderGrid = () => {
    const previewCells = hoveredCell
      ? getPreviewPieceCells(hoveredCell[0], hoveredCell[1])
      : [];

    return grid.map((row: number[], i: number) => {
      const rowElements = row.map((rowElement: number, j: number) => {
        const isPreview = previewCells.includes(`${i}-${j}`);
        const isFilled = rowElement !== -1;

        let cellClass = "";
        if (isFilled) {
          cellClass = pieces[rowElement].color;
        } else if (isPreview) {
          cellClass = pieces[selectedPiece].color;
        } else {
          cellClass = "border-blue-500";
        }

        return (
          <div
            key={`circle-${i}-${j}`}
            className={`w-10 h-10 cursor-pointer m-1 rounded-full border-2 flex items-center justify-center ${cellClass}`}
            onClick={() => placePiece(i, j, selectedPiece)}
            onMouseEnter={() => setHoveredCell([i, j])}
            onMouseLeave={() => setHoveredCell(null)}
          >
            {`${i}-${j}`}
          </div>
        );
      });

      return (
        <div key={`row-${i}`} className="flex flex-row">
          {rowElements}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col pt-40 justify-center items-center">
      <div className="overflow-hidden rounded-md bg-white shadow">
        <ul role="list" className="divide-y divide-gray-200">
          {pieces.map((item, index) => (
            <li
              key={item.color}
              className="px-6 py-4"
              onClick={() => setSelectedPiece(index)}
            >
              {item.color}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <button
          type="button"
          className="rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={rotateSelectedPiece}
        >
          Rotate
        </button>
        <button
          type="button"
          className="rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={flipXSelectedPiece}
        >
          Flip
        </button>
      </div>
      <div className="mt-20 pt-44 rotate-135">{renderGrid()}</div>
    </div>
  );
}


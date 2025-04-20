import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState, useCallback } from "react";
import { PUZZLE_PIECES, createGrid, createPreviewGridForPiece } from "@/utils/puzzlePieces";
import { levels } from "@/levels/levels";
import type { PuzzlePiece } from "@/utils/puzzlePieces";

export const Route = createFileRoute('/puzzles/$puzzleId')({
  component: RouteComponent,
  loader: ({ params: { puzzleId } }: { params: { puzzleId: number } }) => {
    return levels[puzzleId] ? levels[puzzleId] : createGrid()
  }
})

function RouteComponent() {
  const level = Route.useLoaderData();
  const [grid, setGrid] = useState<PuzzlePiece[][]>(level);
  const [hoveredCell, setHoveredCell] = useState<number[] | null>(null);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([
    ...PUZZLE_PIECES,
  ]);
  const [selectedPiece, setSelectedPiece] = useState<PuzzlePiece>(pieces[0]);
  const [placedPieces, setPlacedPieces] = useState<PuzzlePiece[]>([]);

  const transformSelectedPiece = useCallback((transformation: string) => {
    const newPieces = [...pieces].map((piece) => {
      if (piece.id == selectedPiece.id) {
        let newShape;
        switch(transformation) {
          case "rotate":
            newShape = piece.shape.map(([row, col]) => [col, -row]);
            break;
          case "flipX":
            newShape = piece.shape.map(([row, col]) => [-row, col]);
            break;
          case "flipY":
            newShape = piece.shape.map(([row, col]) => [row, -col]);
            break;
          default:
            newShape = piece.shape;
        }

        const newSelectedPiece = {
          ...piece,
          shape: newShape,
        };
        return newSelectedPiece;
      }
      return piece;
    });

    setPieces(newPieces);

    const updatedSelectedPiece = newPieces.find(p => p.id === selectedPiece.id);
    if (updatedSelectedPiece) {
      setSelectedPiece(updatedSelectedPiece);
    }
  }, [pieces, selectedPiece, setPieces, setSelectedPiece]);

  useEffect(() => {
    resetGrid();
  }, []);

  useEffect(() => {
    const handleTransformKeys = (event: KeyboardEvent) => {
      if (event.key === "r") {
        transformSelectedPiece("rotate");
      }
      if (event.key === "f") {
        transformSelectedPiece("flipX");
      }
      if (event.key === "g") {
        transformSelectedPiece("flipY");
      }
    };

    window.addEventListener("keydown", handleTransformKeys);

    return () => {
      window.removeEventListener("keydown", handleTransformKeys);
    };
  }, [transformSelectedPiece]); // Now we only need transformSelectedPiece

  const canPlacePiece = (
    rowIndex: number,
    colIndex: number,
    piece: PuzzlePiece,
  ) => {
    if (piece === undefined) {
      return false;
    }

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
      if (grid[newRow][newCol].id !== -1) {
        return false;
      }
    }

    return true;
  };

  const placePiece = (
    rowIndex: number,
    colIndex: number,
  ) => {
    if (!canPlacePiece(rowIndex, colIndex, selectedPiece)) return;

    const newGrid = grid.map((row) => [...row]);

    for (const [relRow, relCol] of selectedPiece.shape) {
      const newRow = rowIndex + relRow;
      const newCol = colIndex + relCol;
      newGrid[newRow][newCol] = selectedPiece;
    }

    const newPieces = pieces.filter((piece) => piece.id !== selectedPiece.id);
    const newPlacedPieces = [...placedPieces, selectedPiece]

    setPlacedPieces(newPlacedPieces);
    setSelectedPiece(newPieces[0]);
    setPieces(newPieces);
    setGrid(newGrid);
  };

  const getPreviewPieceCells = (
    rowIndex: number,
    colIndex: number,
  ): string[] => {
    if (!canPlacePiece(rowIndex, colIndex, selectedPiece)) return [];

    const previewCells = [];

    for (const [relRow, relCol] of selectedPiece.shape) {
      const newRow = rowIndex + relRow;
      const newCol = colIndex + relCol;

      previewCells.push(`${newRow}-${newCol}`);
    }

    return previewCells;
  };

  const renderGrid = () => {
    const previewCells = hoveredCell
      ? getPreviewPieceCells(hoveredCell[0], hoveredCell[1])
      : [];

    return grid.map((row: PuzzlePiece[], i: number) => {
      const rowElements = row.map((rowElement: PuzzlePiece, j: number) => {
        const isPreview = previewCells.includes(`${i}-${j}`);
        const isFilled = rowElement.id !== -1;

        let cellClass = "";
        if (isFilled) {
          cellClass = rowElement.color;
        } else if (isPreview) {
          cellClass = selectedPiece.color;
        }

        return (
          <div
            key={`circle-${i}-${j}`}
            className={`w-10 h-10 cursor-pointer m-1 rounded-full border-2 flex items-center justify-center ${cellClass}`}
            onClick={() => placePiece(i, j)}
            onMouseEnter={() => setHoveredCell([i, j])}
            onMouseLeave={() => setHoveredCell(null)}
          />
        );
      });

      return (
        <div key={`row-${i}`} className="flex flex-row">
          {rowElements}
        </div>
      );
    });
  };

  const renderPiecePreview = () => {
    return (
      <div className="p-4 h-1/5 border rounded-md">
        <h3 className="text-lg font-medium mb-2">Current Piece</h3>
        {createPreviewGridForPiece(selectedPiece)}
        <div className="mt-10 flex gap-2">
          <button
            type="button"
            className="rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => transformSelectedPiece('rotate')}
          >
            Rotate (R)
          </button>
          <button
            type="button"
            className="rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => transformSelectedPiece('flipX')}
          >
            Flip X (F)
          </button>
          <button
            type="button"
            className="rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => transformSelectedPiece('flipY')}
          >
            Flip Y (G)
          </button>
        </div>
      </div>
    );
  };

  const resetGrid = () => {
    const usedPieces = new Set();

    for (const row of level) {
      for (const col of row) {
        if (col.id !== -1) {
          usedPieces.add(col.id);
        }
      }
    }

    const remainingPieces = [...PUZZLE_PIECES].filter((piece) => !usedPieces.has(piece.id));
    setPlacedPieces([]);
    setGrid(level);
    setPieces(remainingPieces);
    setSelectedPiece(remainingPieces[0]);
  };

  const undoLastPiecePlaced = () => {
    if (placedPieces.length === 0) {
      return
    }

    const newPlacedPieces = [...placedPieces];
    const lastPiecePlaced = newPlacedPieces.pop() as PuzzlePiece;
    const newGrid = [...grid];
    const newPieces = [...pieces, lastPiecePlaced];

    for (let row = 0; row < newGrid.length; row++) {
      for (let col = 0; col < newGrid[row].length; col++) {
        if (newGrid[row][col].id === lastPiecePlaced.id) {
          newGrid[row][col] = {
            id: -1,
            shape: [],
            color: ""
          }

        }
      }
    }

    setPlacedPieces(newPlacedPieces);
    setSelectedPiece(lastPiecePlaced);
    setGrid(newGrid);
    setPieces(newPieces);
  };

  return (
    <div className="static pt-10 flex flex-col justify-center items-center">
      <div className="w-4/5 pb-6 flex flex-row justify-between">
        <button
          type="button"
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <Link to="/">Back to Levels</Link>
        </button>
        <div className="space-x-4">
          <button
            type="button"
            className="rounded-md bg-indigo-50 px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
            onClick={undoLastPiecePlaced}
          >
            Undo
          </button>
          <button
            type="button"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={resetGrid}
          >
            Reset Pieces
          </button>
        </div>
      </div>
      <div className="w-full justify-center flex flex-row">
        {selectedPiece !== undefined && renderPiecePreview()}
        <div className="p-24 rotate-135">{renderGrid()}</div>
      </div>
      {pieces.length > 1 && (
        <div className="xl:absolute xl:bottom-0 xl:w-10/12 overflow-hidden bg-white outline-2 rounded-md">
          <h3 className="font-medium mb-2">Available Pieces</h3>
          <ul role="list" className="relative justify-center flex flex-row flex-wrap divide-y divide-x divide-gray-200">
            {pieces
              .filter((piece) => piece.id !== selectedPiece.id)
              .map((piece) => (
                <li
                  key={piece.color}
                  className="px-6"
                  onClick={() => setSelectedPiece(piece)}
                >
                  {createPreviewGridForPiece(piece, 6)}
                </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


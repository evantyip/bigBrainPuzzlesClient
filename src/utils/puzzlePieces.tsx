export type PuzzlePiece = {
  id: number;
  color: string;
  placed: boolean;
  shape: number[][];
}

export const PUZZLE_PIECES: PuzzlePiece[] = [
  {
    id: 1,
    color: "bg-cyan-300",
    placed: false,
    shape: [
      [-1, 0],
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ],
  },
  {
    id: 2,
    color: "bg-green-300",
    placed: false,
    shape: [
      [-1, 0],
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
    ],
  },
  {
    id: 3,
    color: "bg-zinc-600",
    placed: false,
    shape: [
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
    ],
  },
  {
    id: 4,
    color: "bg-orange-500",
    placed: false,
    shape: [
      [0, 0],
      [1, 0],
      [1, 1],
      [-0, -1],
      [-1, -1],
    ],
  },
  {
    id: 5,
    color: "bg-slate-200",
    placed: false,
    shape: [
      [0, 0],
      [1, 0],
      [2, 0],
      [-1, 0],
      [-1, 1],
    ],
  },
  {
    id: 6,
    color: "bg-purple-700",
    placed: false,
    shape: [
      [0, 0],
      [-1, 0],
      [-2, 0],
      [0, -1],
      [1, -1],
    ],
  },
  {
    id: 7,
    color: "bg-green-800",
    placed: false,
    shape: [
      [0, 0],
      [-1, 0],
      [-2, 0],
      [1, 0],
    ],
  },
  {
    id: 8,
    color: "bg-yellow-300",
    placed: false,
    shape: [
      [0, 0],
      [-1, 0],
      [0, 1],
      [-1, 1],
    ],
  },
  {
    id: 9,
    color: "bg-red-600",
    placed: false,
    shape: [
      [0, 0],
      [-1, 0],
      [1, 0],
      [0, 1],
      [0, -1],
    ],
  },
  {
    id: 10,
    color: "bg-rose-300",
    placed: false,
    shape: [
      [0, 0],
      [-1, 0],
      [0, 1],
    ],
  },
  {
    id: 11,
    color: "bg-blue-700",
    placed: false,
    shape: [
      [0, 0],
      [-1, 0],
      [-2, 0],
      [0, 1],
      [0, 2],
    ],
  },
  {
    id: 12,
    color: "bg-gray-800",
    placed: false,
    shape: [
      [0, 0],
      [-1, 0],
      [1, 0],
      [1, 1],
      [-1, 1],
    ],
  },
];

export const createGrid = (numRows: number = 10): PuzzlePiece[][] => {
  let rows = [];
  for (let i = numRows; i > 0; i--) {
    const rowElements = [];
    for (let j = 0; j < i; j++) {
      rowElements.push(
        {
          id: -1,
          shape: [],
          color: "",
          placed: false
        }
      );
    }
    rows.unshift(rowElements);
  }
  return rows;
};

export const createPreviewGridForPiece = (piece: PuzzlePiece, size: number = 10) => {
  // Create an empty 5x5 grid for the preview
  const previewGrid = Array(5).fill(0).map(() => Array(5).fill({id: -1} as PuzzlePiece));

  // Center the piece with row offset
  const rowOffset = 2;
  const colOffset = 2;

  // Place the piece in the preview grid with offset
  piece.shape.forEach(([row, col]) => {
    const newRow = row + rowOffset;
    const newCol = col + colOffset;

    if (newRow >= 0 && newRow < 5 && newCol >= 0 && newCol < 5) {
      previewGrid[newRow][newCol] = piece;
    }
  });

  return (
    <div className="rotate-135">
      {previewGrid.map((row, i) => (
        <div key={`preview-row-${i}`} className="flex flex-row">
          {row.map((cell, j) => (
            <div
              key={`piece-preview-${i}-${j}`}
              className={`w-${size} h-${size} m-1 rounded-full flex items-center justify-center ${
                cell.id !== -1 ? cell.color : ""
              }`}
            >
            </div>
          ))}
        </div>
      ))}
    </div>
  )
};


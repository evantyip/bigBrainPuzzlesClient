export type puzzlePiece = {
  id: number;
  color: string;
  placed: boolean;
  shape: number[][];
}

export const PUZZLE_PIECES: puzzlePiece[] = [
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


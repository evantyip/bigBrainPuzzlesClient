import { createFileRoute, Link } from '@tanstack/react-router'
import '../App.css'
import { levels } from '@/levels/levels'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="flex flex-col justify-center">
      {Object.keys(levels).map((key) => (
        <Link key={key} to="/puzzles/$puzzleId" params={{ puzzleId: Number(key) }}>
          Level {key}
        </Link>
      ))}
    </div>
  )
}

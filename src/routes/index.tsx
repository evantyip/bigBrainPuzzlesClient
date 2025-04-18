import { createFileRoute, Link } from '@tanstack/react-router'
import '../App.css'
import { levels } from '@/levels/levels'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="pt-10 flex justify-center">
      <ul role="list" className="w-3/4 space-y-3">
        {Object.keys(levels).map((key) => (
          <Link
            key={key}
            to="/puzzles/$puzzleId"
            params={{ puzzleId: Number(key) }}
            className="flex justify-center px-4 py-4 shadow sm:rounded-md sm:px-6"
          >
            Level {key}
          </Link>
        ))}
      </ul>
    </div>
  )
}

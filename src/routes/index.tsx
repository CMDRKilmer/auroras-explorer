import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      Hello Prosperous Universe.
    </div>
  )
}

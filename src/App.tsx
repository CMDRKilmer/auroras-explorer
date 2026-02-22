import { TooltipProvider } from '@radix-ui/react-tooltip'
import { QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { DynamicCreateElementContainer } from 'redyc'
import { LoadingPage } from './components/common/loading'
import { ErrorPage } from './components/pages/error-page'
import { NotFoundPage } from './components/pages/not-found-page'
import { queryClient } from './lib/query'
import { routeTree } from './routeTree.gen'
import './assets/css/materials.css'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  return (
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>
        <DynamicCreateElementContainer>
          <RouterProvider
            router={router}
            defaultPendingComponent={LoadingPage}
            defaultErrorComponent={ErrorPage}
            defaultNotFoundComponent={NotFoundPage}
          />
        </DynamicCreateElementContainer>
      </QueryClientProvider>
    </TooltipProvider>
  )
}

export default App

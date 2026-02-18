import { TooltipProvider } from '@radix-ui/react-tooltip'
import { QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { DynamicCreateElementContainer } from 'redyc'
import { LoadingPage } from './components/common/loading'
import { ErrorPage } from './components/pages/error-page'
import { NotFoundPage } from './components/pages/not-found-page'
import { queryClient } from './lib/query'
import { routeTree } from './routeTree.gen'

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
    <DynamicCreateElementContainer>
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider
            router={router}
            defaultPendingComponent={LoadingPage}
            defaultErrorComponent={ErrorPage}
            defaultNotFoundComponent={NotFoundPage}
          />
        </QueryClientProvider>
      </TooltipProvider>
    </DynamicCreateElementContainer>
  )
}

export default App

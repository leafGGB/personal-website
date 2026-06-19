import { Component, ReactNode } from "react"
import { RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { router } from "./router"
import { LanguageProvider } from "./contexts/LanguageContext"

class ErrorBoundary extends Component<{children:ReactNode}> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  render() {
    if (this.state.error) return (
      <div style={{padding:"40px 20px",fontFamily:"monospace",maxWidth:800,margin:"0 auto"}}>
        <h2 style={{color:"#ef4444",marginBottom:12}}>React Render Error</h2>
        <pre style={{background:"#1a1a1a",color:"#f5f5f5",padding:16,borderRadius:8,fontSize:13,whiteSpace:"pre-wrap",overflow:"auto"}}>
          {this.state.error.message}
          {"\n\n"}
          {this.state.error.stack}
        </pre>
      </div>
    )
    return this.props.children
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <RouterProvider router={router} />
      </LanguageProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  )
}

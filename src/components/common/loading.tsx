import './loading.css'

export const Loading = () => {
  return <span className="loading-spinner"></span>
}

export const LoadingPage = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loading />
    </div>
  )
}

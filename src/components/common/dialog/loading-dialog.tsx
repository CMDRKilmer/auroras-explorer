import { dialog } from 'redyc'
import { Spinner } from '@/components/ui/spinner'
import { AutoOpenDialog } from './auto-open-dialog'

export const loadingDialog = (message: string = 'Loading...') => {
  const ref = dialog(
    <AutoOpenDialog className="w-50" showCloseButton={false}>
      <div className="flex items-center justify-center gap-4">
        <Spinner />
        <span>{message}</span>
      </div>
    </AutoOpenDialog>,
  )

  return () => ref.current?.close()
}

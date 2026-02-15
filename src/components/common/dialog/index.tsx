import { DialogContent } from '@radix-ui/react-dialog'
import {
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { dynamicCreateElement } from 'redyc'
import { Dialog } from '@/components/ui/dialog'

export const AutoOpenDialog: FC<{
  children: ReactNode
  onClose: () => void
}> = ({ children, onClose }) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(true)
  }, [])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onClose()
      }
    },
    [onClose],
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  )
}

export const dialog = (content: ReactNode) => {
  const dismiss = dynamicCreateElement(
    <AutoOpenDialog
      onClose={() => {
        dismiss()
      }}
    >
      {content}
    </AutoOpenDialog>,
  )

  return dismiss
}

import type { FC, ReactNode } from 'react'
import { autoOpenModal } from 'redyc'
import { Dialog, DialogContent } from '@/components/ui/dialog'

export const DialogWrapper: FC<{
  open: boolean
  onClose?: () => void
  children: ReactNode
  className?: string
  showCloseButton?: boolean
}> = ({ open, onClose, children, className, showCloseButton }) => {
  return (
    <Dialog open={open} onOpenChange={open => !open && onClose?.()}>
      <DialogContent className={className} showCloseButton={showCloseButton}>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export const AutoOpenDialog = autoOpenModal(DialogWrapper)

import type { FC, ReactNode } from 'react'
import { autoOpenModal } from 'redyc'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export const AlertDialogWrapper: FC<{
  open: boolean
  onClose?: () => void
  children: ReactNode
}> = ({ open, onClose, children }) => {
  return (
    <AlertDialog open={open} onOpenChange={open => !open && onClose?.()}>
      {children}
    </AlertDialog>
  )
}

export const ConfirmDialogContent: FC<{
  onOk: () => void
  onCancel: () => void
  title?: string
  description?: ReactNode
}> = ({
  onOk,
  onCancel,
  title = 'Are you absolutely sure?',
  description = 'This action cannot be undone.',
}) => {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel
          onClick={() => {
            onCancel()
          }}
        >
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={() => {
            onOk()
          }}
        >
          Continue
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

export const AutoOpenAlertDialog = autoOpenModal(AlertDialogWrapper)

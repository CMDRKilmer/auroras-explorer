import type { ReactNode } from 'react'
import { dialog } from 'redyc'
import { AutoOpenAlertDialog, ConfirmDialogContent } from './alert-dialog'

export const confirm = ({
  title,
  description,
}: {
  title?: string
  description?: ReactNode
} = {}) => {
  return new Promise<boolean>(resolve => {
    const ref = dialog(
      <AutoOpenAlertDialog>
        <ConfirmDialogContent
          title={title}
          description={description}
          onOk={() => {
            resolve(true)
            ref.current?.close()
          }}
          onCancel={() => {
            resolve(false)
            ref.current?.close()
          }}
        />
      </AutoOpenAlertDialog>,
    )
  })
}

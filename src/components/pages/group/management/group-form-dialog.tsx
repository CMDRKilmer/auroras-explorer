import { useForm, useStore } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import type { FC } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { apiClient } from '@/lib/api'
import type { Group } from '@/lib/api/types'
import { queryClient } from '@/lib/query'
import { AppError } from '@/server/common/error'

interface GroupFormValues {
  name: string
  fioGroupId: string
  fioApiToken: string
  useMyToken: boolean
}

export const GroupFormDialog: FC<{
  open: boolean
  onOpenChange: (open: boolean) => void
  group?: Group
}> = ({ open, onOpenChange, group }) => {
  const isEdit = !!group

  const mutation = useMutation({
    mutationFn: async (values: GroupFormValues) => {
      const res = await apiClient.post('/api/group', {
        name: values.name,
        fioGroupId: values.fioGroupId,
        fioApiToken: values.useMyToken ? undefined : values.fioApiToken,
        useMyToken: values.useMyToken,
      })
      return res.data as Group
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-groups'] })
      onOpenChange(false)
    },
  })

  const form = useForm({
    defaultValues: {
      name: group?.name ?? '',
      fioGroupId: group?.fioGroupId ?? '',
      fioApiToken: '',
      useMyToken: false,
    } satisfies GroupFormValues as GroupFormValues,
    onSubmit: ({ value }) => {
      mutation.mutate(value)
    },
  })

  const useMyToken = useStore(form.store, state => state.values.useMyToken)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form
          onSubmit={e => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Group' : 'Create Group'}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? 'Update the group settings. You must be an admin of the FIO group.'
                : 'Link a FIO group to start tracking. You must be an admin of the FIO group.'}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <form.Field
              name="name"
              validators={{
                onSubmit: ({ value }) => {
                  if (!value.trim()) {
                    return { message: 'Group name is required.' }
                  }
                },
              }}
            >
              {field => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Group Name</FieldLabel>
                    <Input
                      id={field.name}
                      placeholder="My Corp Group"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field
              name="fioGroupId"
              validators={{
                onSubmit: ({ value }) => {
                  if (!value.trim()) {
                    return { message: 'FIO Group ID is required.' }
                  }
                },
              }}
            >
              {field => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>FIO Group ID</FieldLabel>
                    <Input
                      id={field.name}
                      placeholder="e.g. 12345"
                      disabled={isEdit}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="useMyToken">
              {field => (
                <Field>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={field.name}
                      checked={field.state.value}
                      onCheckedChange={v => field.handleChange(v === true)}
                    />
                    <FieldLabel htmlFor={field.name} className="mb-0">
                      Use my FIO API token
                    </FieldLabel>
                  </div>
                </Field>
              )}
            </form.Field>

            {!useMyToken && (
              <form.Field
                name="fioApiToken"
                validators={{
                  onSubmit: ({ value }) => {
                    if (!useMyToken && !value.trim()) {
                      return { message: 'FIO API Token is required.' }
                    }
                  },
                }}
              >
                {field => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        FIO API Token
                      </FieldLabel>
                      <Input
                        id={field.name}
                        type="text"
                        placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={e => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />
                      <FieldDescription>
                        A FIO API token with access to this group.
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              </form.Field>
            )}

            {mutation.error && (
              <p className="text-destructive text-sm">
                {mutation.error instanceof AppError
                  ? mutation.error.message
                  : 'An error occurred. Please try again.'}
              </p>
            )}
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Spinner data-icon="inline-start" />}
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

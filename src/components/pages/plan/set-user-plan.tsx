import { useForm, useStore } from '@tanstack/react-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { FC } from 'react'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { apiClient } from '@/lib/api'
import { assert } from '@/lib/assert'
import { getPlanIdFromLink } from '@/lib/planner/util'
import { queryClient } from '@/lib/query'
import { groupPlansQuery } from '@/lib/query/group'
import { sharedPlanQuery } from '@/lib/query/plan'
import { GroupMemberSelectSingle } from '../group/group-member-select'

export interface SetUserPlanFormValues {
  username: string
  planUrl: string
}

export const SetUserPlanDialogContent: FC<{
  groupId: string
  close: () => void
  defaultValue?: SetUserPlanFormValues
}> = ({ groupId, close, defaultValue }) => {
  const { t } = useTranslation()
  const setUserPlan = useMutation({
    mutationKey: ['set-user-planet-plan', groupId],
    mutationFn: async ({ username, planUrl }: SetUserPlanFormValues) => {
      const planId = getPlanIdFromLink(planUrl)
      assert(planId, 'Invalid plan link')

      const res = await apiClient.post(`/api/group/${groupId}/plan`, {
        username: username.toUpperCase(),
        planId,
        planetId: planInfo.data?.plan_details.planet_natural_id,
        groupId,
      })

      if (res.status !== 200) {
        throw new Error(res.data.message)
      }

      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(groupPlansQuery(groupId))
      close()
      form.reset()
    },
  })

  const form = useForm({
    defaultValues: {
      username: defaultValue?.username || '',
      planUrl: defaultValue?.planUrl || '',
    },
    onSubmit: ({ value }) => {
      setUserPlan.mutate(value)
    },
  })

  const planLink = useStore(form.store, state => state.values.planUrl)
  const planId = getPlanIdFromLink(planLink)
  const planInfo = useQuery(sharedPlanQuery(planId))

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <DialogHeader>
        <DialogTitle>{t('plan.setUserPlanOnPlanet')}</DialogTitle>
        <DialogDescription>
          Setup user base plan on planet to view contracts and production
          overview.
        </DialogDescription>
      </DialogHeader>

      {setUserPlan.error && (
        <div className="mt-4 text-destructive">
          {setUserPlan.error instanceof Error
            ? setUserPlan.error.message
            : 'An error occurred'}
        </div>
      )}

      <FieldSet className="mt-4">
        <FieldGroup>
          <form.Field
            name="username"
            validators={{
              onSubmit: ({ value }) => {
                if (!value) {
                  return { message: 'Please select a user.' }
                }
              },
            }}
          >
            {field => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>{t('plan.user')}</FieldLabel>

                  <GroupMemberSelectSingle
                    groupId={groupId}
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={field.handleChange}
                    aria-invalid={isInvalid}
                    placeholder="Select User"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>

          <form.Field
            name="planUrl"
            validators={{
              onSubmit: ({ value }) => {
                if (!value) {
                  return { message: 'Please enter the plan link.' }
                }
                const planId = getPlanIdFromLink(value)
                if (!planId) {
                  return { message: 'Invalid plan link.' }
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
                    {t('plan.planLink')}
                  </FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    type="url"
                    placeholder="https://prunplanner.org/shared/xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
        </FieldGroup>
      </FieldSet>

      {planInfo.data ? (
        <div className="mt-4 p-4 border rounded">
          <div className="mb-2 text-sm text-muted-foreground">
            {t('plan.planInfo')}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex gap-2 items-center">
              <div className="text-sm font-medium">{t('plan.name')}</div>
              <div className="text-sm text-muted-foreground">
                {planInfo.data.plan_details.plan_name}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="text-sm font-medium">{t('plan.planetId')}</div>
              <div className="text-sm text-muted-foreground">
                {planInfo.data.plan_details.planet_natural_id}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="text-sm font-medium">{t('plan.buildings')}</div>
              <div className="flex gap-1 text-sm text-muted-foreground">
                {planInfo.data.plan_details.plan_data.buildings.map(i => {
                  return (
                    <span key={i.name} className="">
                      {i.name} *{i.amount}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      ) : planInfo.isFetching ? (
        <div className="mt-4 flex items-center gap-2">
          <Spinner />
          Fetching plan info...
        </div>
      ) : planId ? (
        <div className="mt-4 text-destructive">
          Failed to fetch plan info. Please check the plan link.
        </div>
      ) : null}

      <DialogFooter className="mt-8">
        <DialogClose asChild>
          <Button variant="outline" disabled={setUserPlan.isPending}>
            {t('common.cancel')}
          </Button>
        </DialogClose>
        <Button type="submit" disabled={setUserPlan.isPending}>
          {setUserPlan.isPending ? <Spinner data-icon="inline-start" /> : null}
          {t('common.save')}
        </Button>
      </DialogFooter>
    </form>
  )
}

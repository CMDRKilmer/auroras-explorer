import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { compact } from 'es-toolkit'
import { type FC, useCallback, useMemo } from 'react'
import { isHotkeyPressed } from 'react-hotkeys-hook'
import { dialog } from 'redyc'
import { inspect } from '@/components/common/dialog'
import { AutoOpenDialog } from '@/components/common/dialog/auto-open-dialog'
import { confirm } from '@/components/common/dialog/confirm'
import { loadingDialog } from '@/components/common/dialog/loading-dialog'
import { LoadingPage } from '@/components/common/loading'
import { Button } from '@/components/ui/button'
import { apiClient } from '@/lib/api'
import { getPlanLinkFromId } from '@/lib/planner/util'
import { queryClient } from '@/lib/query'
import { groupPlansQuery } from '@/lib/query/group'
import MdiClose from '~icons/mdi/close'
import MdiEdit from '~icons/mdi/edit'
import MdiLink from '~icons/mdi/link'
import MdiPlus from '~icons/mdi/plus'
import MdiTrash from '~icons/mdi/trash'
import { SetUserPlanDialogContent } from './set-user-plan'

export const GroupPlanPage: FC<{
  groupId: string
}> = ({ groupId }) => {
  const { t } = useTranslation()
  const { data: plans } = useQuery(groupPlansQuery(groupId))

  const refetchPlans = useCallback(() => {
    queryClient.invalidateQueries(groupPlansQuery(groupId))
  }, [groupId])

  const groupedPlans = useMemo(() => {
    if (!plans) return []
    return compact(Object.values(Object.groupBy(plans, plan => plan.planId)))
  }, [plans])

  return (
    <div className="p-4">
      <div className="w-full flex justify-between ">
        <h1>{t('group.plans.title')}</h1>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {!groupedPlans ? (
          <LoadingPage />
        ) : (
          groupedPlans.map(plans => {
            const plan = plans[0]
            return (
              <div
                key={plan.id}
                className="flex flex-col gap-2 px-4 py-2 border rounded-md group"
              >
                <div className="flex items-center gap-4">
                  <span className="font-medium text-sm">{plan.planetId}</span>
                  <span className="text-muted-foreground">{plan.planName}</span>
                  <Button
                    variant="ghost"
                    className="text-muted-foreground"
                    asChild
                  >
                    <a href={getPlanLinkFromId(plan.planId)} target="_blank">
                      <MdiLink />
                      {t('group.plans.planLink')}
                    </a>
                  </Button>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-all">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const ref = dialog(
                          <AutoOpenDialog>
                            <SetUserPlanDialogContent
                              groupId={groupId}
                              defaultValue={{
                                planUrl: getPlanLinkFromId(plan.planId),
                                username: plan.username,
                              }}
                              close={() => {
                                ref.current?.close()
                                refetchPlans()
                              }}
                            />
                          </AutoOpenDialog>,
                        )
                      }}
                    >
                      <MdiEdit />
                      {t('group.plans.edit')}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        const ok = await confirm()
                        if (!ok) return
                        const close = loadingDialog()
                        await apiClient.delete(
                          `/api/group/${groupId}/plan/${plan.id}`,
                        )
                        close()
                        refetchPlans()
                      }}
                    >
                      <MdiTrash />
                      {t('group.plans.delete')}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {plans.map(plan => {
                    return (
                      <div
                        key={plan.username}
                        onClick={() => {
                          if (isHotkeyPressed('backquote')) {
                            inspect(plan)
                          }
                        }}
                        className="flex items-center gap-1 text-sm text-muted-foreground border rounded-md px-2 py-1 hover:text-muted-foreground/80 transition-all"
                      >
                        {plan.username}
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={async () => {
                            const ok = await confirm()
                            if (!ok) return
                            const close = loadingDialog()
                            await apiClient.delete(
                              `/api/group/${groupId}/plan/${plan.id}`,
                            )
                            close()
                            refetchPlans()
                          }}
                        >
                          <MdiClose />
                        </Button>
                      </div>
                    )
                  })}

                  <Button
                    variant="ghost"
                    onClick={() => {
                      const ref = dialog(
                        <AutoOpenDialog>
                          <SetUserPlanDialogContent
                            groupId={groupId}
                            defaultValue={{
                              planUrl: getPlanLinkFromId(plan.planId),
                              username: '',
                            }}
                            close={() => {
                              ref.current?.close()
                              refetchPlans()
                            }}
                          />
                        </AutoOpenDialog>,
                      )
                    }}
                  >
                    <MdiPlus />
                    {t('group.plans.addUser')}
                  </Button>
                </div>
              </div>
            )
          })
        )}

        <Button
          className="w-full"
          variant="outline"
          onClick={() => {
            const ref = dialog(
              <AutoOpenDialog>
                <SetUserPlanDialogContent
                  groupId={groupId}
                  close={() => {
                    ref.current?.close()
                    refetchPlans()
                  }}
                />
              </AutoOpenDialog>,
            )
          }}
        >
          {t('group.plans.addPlan')}
        </Button>
      </div>
    </div>
  )
}

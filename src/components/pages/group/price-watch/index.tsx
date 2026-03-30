import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { type FC, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { LoadingPage } from '@/components/common/loading'
import { Pagination } from '@/components/common/pagination'
import { ContractPriceInsight } from '@/components/game/contract/contract-price-insight'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { Field, FieldLabel } from '@/components/ui/field'
import { ContractTags } from '@/lib/constants'
import { getDateRange } from '@/lib/date'
import { getPaginationInstance } from '@/lib/pagination'
import { groupContractsQuery } from '@/lib/query/contract'
import { GroupMemberSelect } from '../group-member-select'

export const GroupPriceWatchPage: FC<{
  groupId: string
}> = ({ groupId }) => {
  const { t } = useTranslation()
  const [date, setDate] = useState<DateRange | undefined>(() =>
    getDateRange('last-7-days'),
  )

  const [usernames, setUsernames] = useState<string[]>([])

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  })

  const { data: contracts } = useQuery(
    groupContractsQuery({
      groupId,
      order: '-DateEpochMs',
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      types: ['BUYING', 'SELLING'],
      tags: [ContractTags.PRICE_NORMAL],
      statuses: ['OPEN', 'FULFILLED', 'PARTIALLY_FULFILLED'],
      time: date,
      usernames,
    }),
  )

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{t('group.priceWatch.title')}</h1>

      <div className="flex gap-4 justify-start">
        <DatePickerWithRange date={date} setDate={setDate} />

        <Field className="w-50">
          <FieldLabel>{t('group.members.title')}</FieldLabel>
          <GroupMemberSelect
            groupId={groupId}
            value={usernames}
            onChange={setUsernames}
          />
        </Field>
      </div>

      <div className="mt-4 flex flex-col">
        {contracts ? (
          contracts.items.length ? (
            contracts.items.map(contract => {
              return (
                <ContractPriceInsight
                  key={contract.ContractId}
                  contract={contract}
                />
              )
            })
          ) : (
            <div>{t('dataTable.noResults')}</div>
          )
        ) : (
          <LoadingPage />
        )}
      </div>

      {contracts?.items.length ? (
        <div className="mt-4 flex justify-end">
          <Pagination
            table={getPaginationInstance(
              pagination,
              ((contracts?.total ?? 0) / pagination.pageSize) << 0,
              setPagination,
            )}
            pagination={pagination}
          />
        </div>
      ) : null}
    </div>
  )
}

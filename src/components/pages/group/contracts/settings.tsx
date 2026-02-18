import { useQuery } from '@tanstack/react-query'
import { DataTableViewOptions } from '@/components/common/data-table/column-toggle'
import { Field, FieldLabel } from '@/components/ui/field'
import MultipleSelector from '@/components/ui/multiple-select'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { groupUsersQuery } from '@/lib/query/group'
import { StatusMap, TypesMap } from './constants'
import { useGroupContractsPageContext } from './context'

export const Settings = () => {
  const {
    groupId,
    usernames,
    setUsernames,
    type,
    setType,
    status,
    setStatus,
    table,
  } = useGroupContractsPageContext()
  const { data: users } = useQuery(groupUsersQuery(groupId))

  return (
    <div className="mb-4 flex flex-wrap gap-4 items-end">
      <div className="flex-1" />

      <Field className="w-50">
        <FieldLabel>Users</FieldLabel>
        <MultipleSelector
          className="w-full"
          defaultOptions={[]}
          options={
            users
              ?.map(user => ({
                label: user.username,
                value: user.username,
              }))
              .filter(user => user.value) || []
          }
          value={usernames.map(username => ({
            label: username,
            value: username,
          }))}
          onChange={values => {
            setUsernames(values.map(v => v.value))
          }}
          placeholder="Select User"
          inputProps={{
            className: 'w-full',
          }}
          emptyIndicator="No users found"
        />
      </Field>

      <Field className="w-40">
        <FieldLabel>Type</FieldLabel>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select contract type" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(TypesMap).map(type => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field className="w-40">
        <FieldLabel>Status</FieldLabel>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select contract status" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(StatusMap).map(status => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <DataTableViewOptions table={table} />
    </div>
  )
}

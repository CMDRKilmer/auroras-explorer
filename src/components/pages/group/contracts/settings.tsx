import { useQuery } from '@tanstack/react-query'
import { Field, FieldLabel } from '@/components/ui/field'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/motion-tabs'
import MultipleSelector from '@/components/ui/multiple-select'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { groupUsersQuery } from '@/lib/query/group'
import { StatusMap } from './constants'
import { useGroupContractsPageContext } from './context'

export const Settings = () => {
  const { usernames, setUsernames, type, setType, status, setStatus } =
    useGroupContractsPageContext()
  const { data: users } = useQuery(groupUsersQuery('873386'))

  return (
    <div className="mb-4 flex flex-wrap gap-4 items-end">
      <Tabs value={type} onValueChange={setType}>
        <TabsList>
          <TabsTrigger value="All">All Contracts</TabsTrigger>
          <TabsTrigger value="Trading">Trading</TabsTrigger>
          <TabsTrigger value="Shipment">Shipment</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex-1" />

      <Field className="w-100">
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
          placeholder="Select users to filter contracts"
          inputProps={{
            className: 'w-full',
          }}
          emptyIndicator="No users found"
        />
      </Field>

      <Field className="w-100">
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
    </div>
  )
}

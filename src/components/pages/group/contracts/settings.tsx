import { useQuery } from '@tanstack/react-query'
import { Field, FieldLabel } from '@/components/ui/field'
import MultipleSelector from '@/components/ui/multiple-select'
import { groupUsersQuery } from '@/lib/query/group'
import { useGroupContractsPageContext } from './context'

export const Settings = () => {
  const { usernames, setUsernames } = useGroupContractsPageContext()
  const { data: users } = useQuery(groupUsersQuery('873386'))

  return (
    <div className="mb-4 flex flex-wrap gap-4">
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
    </div>
  )
}

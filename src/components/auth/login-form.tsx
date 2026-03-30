import { useMutation } from '@tanstack/react-query'
import { type FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { setItem } from '@/hooks/use-storage'
import { apiClient } from '@/lib/api'
import { queryClient } from '@/lib/query'
import { cn } from '@/lib/utils'
import { AppError } from '@/server/common/error'

export interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export const LoginForm: FC<LoginFormProps> = ({ className, ...props }) => {
  const { t } = useTranslation()
  const [token, setToken] = useState('')

  const exchangeTokenMutation = useMutation({
    mutationFn: async (fioToken: string) => {
      const res = await apiClient.post('/api/token/exchange', {
        fioToken,
      })
      return res.data.token as string
    },
    onSuccess: token => {
      setItem('token', token)
      queryClient.clear()
    },
  })

  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center',
        className,
      )}
      {...props}
    >
      <Card className="min-w-md">
        <CardHeader>
          <CardTitle>{t('auth.thisPageRequiresAuthorization')}</CardTitle>
          <CardDescription>
            We will use FIO token to identify your account. Please enter your
            FIO token to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={e => {
              e.preventDefault()
              exchangeTokenMutation.mutate(token)
            }}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="fioToken">{t('auth.fioToken')}</FieldLabel>
                <Input
                  id="fioToken"
                  type="text"
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  required
                  value={token}
                  onChange={e => setToken(e.target.value)}
                />
                {exchangeTokenMutation.error && (
                  <FieldDescription className="text-destructive">
                    {exchangeTokenMutation.error instanceof AppError ? (
                      exchangeTokenMutation.error.message
                    ) : (
                      <p>A network error occurred. Please try again.</p>
                    )}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                {exchangeTokenMutation.isPending ? (
                  <Button type="submit">
                    <Spinner data-icon="inline-start" />
                    {t('common.loading')}
                  </Button>
                ) : (
                  <Button type="submit">{t('auth.authorize')}</Button>
                )}
                <FieldDescription className="text-center">
                  We will never share your token with anyone else.
                  <br />
                  <a
                    href="https://fio.fnar.net/settings"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get your FIO token
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

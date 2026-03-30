import { useForm, useStore } from '@tanstack/react-form'
import { debounce } from 'es-toolkit'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { getItem, setItem } from '@/hooks/use-storage'
import IconCheck from '~icons/mdi/check'
import IconContentCopy from '~icons/mdi/content-copy'
import { transformConfig } from './transform-config'

export const ConfigTransformPage = () => {
  const { t } = useTranslation()
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const STORAGE_KEY = 'config-transform:form'

  const form = useForm({
    defaultValues: getItem<{
      location: string
      currency: string
      sourceConfig: string
    }>(STORAGE_KEY) ?? {
      location: '',
      currency: 'ICA',
      sourceConfig: '',
    },
  })

  const values = useStore(form.store, state => state.values)

  const saveToStorage = useMemo(
    () => debounce((v: typeof values) => setItem(STORAGE_KEY, v), 500),
    [],
  )

  useEffect(() => {
    saveToStorage(values)
  }, [values, saveToStorage])

  const transform = useMemo(
    () =>
      debounce(
        (vals: {
          location: string
          currency: string
          sourceConfig: string
        }) => {
          if (!vals.sourceConfig.trim()) {
            setError(null)
            setResult(null)
            return
          }

          try {
            const output = transformConfig(vals)
            setResult(JSON.stringify(output, null, 2))
            setError(null)
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Transform failed.')
            setResult(null)
          }
        },
        300,
      ),
    [],
  )

  useEffect(() => {
    transform(values)
  }, [values, transform])

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <h1 className="text-xl font-semibold">{t('configTransform.title')}</h1>

      <p className="text-xs text-muted-foreground">
        {t('configTransform.description')}
      </p>

      <div className="grid flex-1 grid-cols-2 gap-6 overflow-hidden">
        {/* Left Column - Input */}
        <div className="flex flex-col gap-4 overflow-auto">
          <FieldGroup>
            <form.Field name="location">
              {field => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    {t('configTransform.location')}
                  </FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="e.g. VH-331d (format is matter)"
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="currency">
              {field => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    {t('configTransform.currency')}
                  </FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NCC">NCC</SelectItem>
                      <SelectItem value="AIC">AIC</SelectItem>
                      <SelectItem value="CIS">CIS</SelectItem>
                      <SelectItem value="ICA">ICA</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </form.Field>

            <form.Field name="sourceConfig">
              {field => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    {t('configTransform.sourceConfigJson')}
                  </FieldLabel>
                  <FieldDescription>
                    {t('configTransform.pasteConfigHint')}
                  </FieldDescription>
                  <Textarea
                    id={field.name}
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="{ ... }"
                    className="min-h-75 max-h-30 font-mono text-sm resize-none"
                  />
                </Field>
              )}
            </form.Field>
          </FieldGroup>
        </div>

        {/* Right Column - Result */}
        <div className="flex flex-col gap-2 overflow-hidden">
          <div className="flex items-center justify-between">
            <FieldLabel>{t('configTransform.transformedResult')}</FieldLabel>
            <Button
              variant="outline"
              size="sm"
              disabled={!result}
              onClick={() => {
                if (result) {
                  navigator.clipboard.writeText(result)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }
              }}
            >
              {copied ? (
                <>
                  <IconCheck className="size-4" /> {t('common.copied')}
                </>
              ) : (
                <>
                  <IconContentCopy className="size-4" /> {t('common.copy')}
                </>
              )}
            </Button>
          </div>
          <Textarea
            readOnly
            value={error ?? result ?? ''}
            placeholder={t('configTransform.noResultYet')}
            className={`flex-1 max-h-120 resize-none font-mono text-sm ${error ? 'text-destructive' : ''}`}
          />
        </div>
      </div>
    </div>
  )
}

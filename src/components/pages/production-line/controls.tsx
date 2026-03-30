import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import MdiArrowBack from '~icons/mdi/arrow-back'
import MdiArrowForward from '~icons/mdi/arrow-forward'
import { useExplorerContext } from './context'

export const ExplorerControls = () => {
  const { t } = useTranslation()
  const { canBack, canForward, back, forward } = useExplorerContext()

  return (
    <ButtonGroup>
      <Button
        className="w-40"
        variant="outline"
        disabled={!canBack}
        onClick={back}
      >
        <MdiArrowBack />
        {t('common.back')}
      </Button>
      <Button
        className="w-40"
        variant="outline"
        disabled={!canForward}
        onClick={forward}
      >
        {t('common.forward')}
        <MdiArrowForward />
      </Button>
    </ButtonGroup>
  )
}

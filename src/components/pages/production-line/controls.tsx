import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import MdiArrowBack from '~icons/mdi/arrow-back'
import MdiArrowForward from '~icons/mdi/arrow-forward'
import { useExplorerContext } from './context'

export const ExplorerControls = () => {
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
        Back
      </Button>
      <Button
        className="w-40"
        variant="outline"
        disabled={!canForward}
        onClick={forward}
      >
        Forward
        <MdiArrowForward />
      </Button>
    </ButtonGroup>
  )
}

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface RewardModalActionsProps {
  canCreateReward: boolean
  isSubmitting: boolean
  tooltipMessage: string
  onSubmit: () => void
  onCancel: () => void
}

export function RewardModalActions({
  canCreateReward,
  isSubmitting,
  tooltipMessage,
  onSubmit,
  onCancel,
}: RewardModalActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 pt-1">
      <Button
        variant="outline"
        className="h-10 w-full border-border-dropdown bg-background-primary text-base font-normal leading-[140%] text-text-primary hover:bg-background-tertiary"
        onClick={onCancel}
      >
        Cancel
      </Button>

      {canCreateReward && !isSubmitting ? (
        <Button
          className="h-10 w-full bg-action-primary text-base font-normal leading-[140%] text-white hover:bg-action-primary-hover"
          onClick={onSubmit}
        >
          Create Reward
        </Button>
      ) : (
        <Tooltip>
          <TooltipTrigger
            render={<span className="inline-flex w-full cursor-not-allowed" />}
          >
            <Button
              className="h-10 w-full bg-action-disabled text-base font-normal leading-[140%] text-white hover:bg-action-disabled disabled:opacity-100"
              disabled
            >
              {isSubmitting ? 'Creating...' : 'Create Reward'}
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            className="rounded-md bg-neutral-800 text-[11px] text-white"
          >
            {tooltipMessage || 'Complete required fields to continue.'}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}

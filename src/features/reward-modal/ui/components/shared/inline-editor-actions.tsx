import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface InlineEditorActionsProps {
  onCancel: () => void
  onSave: () => void
  isSaveDisabled: boolean
  saveTooltipMessage?: string | null
  cancelLabel?: string
  saveLabel?: string
}

export function InlineEditorActions({
  onCancel,
  onSave,
  isSaveDisabled,
  saveTooltipMessage,
  cancelLabel = 'Cancel',
  saveLabel = 'Save',
}: InlineEditorActionsProps) {
  return (
    <div className="grid w-full grid-cols-2 gap-4">
      <Button
        type="button"
        variant="outline"
        className="h-10 w-full border-border-dropdown bg-background-primary text-base font-normal leading-[140%] text-text-primary hover:bg-background-tertiary"
        onClick={onCancel}
      >
        {cancelLabel}
      </Button>

      {isSaveDisabled ? (
        <Tooltip>
          <TooltipTrigger
            render={<span className="inline-flex w-full cursor-not-allowed" />}
          >
            <Button
              type="button"
              disabled
              className="h-10 w-full bg-action-disabled text-base font-normal leading-[140%] text-white hover:bg-action-disabled disabled:opacity-100"
            >
              {saveLabel}
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            className="rounded-md bg-neutral-800 text-[11px] text-white"
          >
            {saveTooltipMessage || 'Complete required fields to continue.'}
          </TooltipContent>
        </Tooltip>
      ) : (
        <Button
          type="button"
          className="h-10 w-full bg-action-primary text-base font-normal leading-[140%] text-white hover:bg-action-primary-hover"
          onClick={onSave}
        >
          {saveLabel}
        </Button>
      )}
    </div>
  )
}

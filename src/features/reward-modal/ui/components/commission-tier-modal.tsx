import { useEffect, useState } from 'react'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { COMMISSION_TIER_OPTIONS } from '@/features/reward-modal/config/options'
import { cn } from '@/lib/utils'
import { FormField } from '@/shared/ui/form-field'

interface CommissionTierModalProps {
  open: boolean
  selectedTier: string
  onSelectTier: (tier: string) => void
  onSave: () => void
  onGoBack: () => void
}

export function CommissionTierModal({
  open,
  selectedTier,
  onSelectTier,
  onSave,
  onGoBack,
}: CommissionTierModalProps) {
  const [isTierDropdownOpen, setIsTierDropdownOpen] = useState(false)

  useEffect(() => {
    if (!open) {
      setIsTierDropdownOpen(false)
    }
  }, [open])

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onGoBack()
        }
      }}
    >
      <DialogContent
        showOverlay={false}
        showCloseButton={false}
        className="w-[calc(100vw-2rem)] max-w-[400px] sm:h-[224px] max-h-[calc(100dvh-2rem)] gap-6 rounded-xl bg-background-primary p-6 shadow-modal ring-1 ring-border-dropdown"
      >
        <DialogHeader className="w-full max-w-[352px]">
          <DialogTitle className="text-[20px] font-medium leading-[140%] text-text-primary">
            Select a commission tier
          </DialogTitle>
        </DialogHeader>

        <FormField label="Upgrade to" required>
          <Popover open={isTierDropdownOpen} onOpenChange={setIsTierDropdownOpen}>
            <PopoverTrigger
              className={cn(
                'flex h-10 w-full items-center justify-between rounded-lg border px-2.5 text-left text-base font-normal leading-[140%] text-text-primary transition-colors duration-100 ease-out focus-visible:border-action-primary focus-visible:ring-action-primary/25',
                'border-border-dropdown'
              )}
            >
              <span
                className={cn(
                  'truncate',
                  selectedTier.trim() ? 'text-text-primary' : 'text-text-placeholder'
                )}
              >
                {selectedTier.trim() || 'Select a tier'}
              </span>
              <ChevronDownIcon className="size-4 text-neutral-500" />
            </PopoverTrigger>

            <PopoverContent className="!w-[--anchor-width] !gap-1 !rounded-[4px] !p-1 data-open:zoom-in-100 data-closed:zoom-out-100 data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 duration-150 ease-out">
              <div className="space-y-0.5">
                {COMMISSION_TIER_OPTIONS.map((tier) => {
                  const isSelected = selectedTier === tier

                  return (
                    <button
                      type="button"
                      key={tier}
                      className={cn(
                        'flex w-full items-center justify-between rounded-[4px] px-2 py-1.5 text-left text-sm transition',
                        isSelected
                          ? 'bg-background-tertiary text-action-primary'
                          : 'text-text-primary hover:bg-neutral-100'
                      )}
                      onClick={() => {
                        onSelectTier(tier)
                        setIsTierDropdownOpen(false)
                      }}
                    >
                      <span>{tier}</span>
                      {isSelected ? <CheckIcon className="size-4" /> : null}
                    </button>
                  )
                })}
              </div>
            </PopoverContent>
          </Popover>
        </FormField>

        <div className="grid grid-cols-2 gap-4 pt-1">
          <Button
            type="button"
            variant="outline"
            className="h-10 w-full border-border-dropdown bg-background-primary text-base font-normal leading-[140%] text-text-primary hover:bg-background-tertiary"
            onClick={onGoBack}
          >
            Go back
          </Button>
          <Button
            type="button"
            className="h-10 w-full bg-action-primary text-base font-normal leading-[140%] text-white hover:bg-action-primary-hover disabled:bg-action-disabled disabled:opacity-100"
            disabled={!selectedTier.trim()}
            onClick={onSave}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

import { Button } from '@/components/ui/button'
import gamificationBackgroundPattern from '@/assets/landing/gamification-bg-pattern.png'

interface HeroSectionProps {
  onEnableGamification: () => void
}

export function HeroSection({ onEnableGamification }: HeroSectionProps) {
  return (
    <section className="my-auto mb-6 w-full  rounded-xl border border-border-primary bg-background-primary px-4 py-6">
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={gamificationBackgroundPattern}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />

        <div className="relative mx-auto flex h-[155px] w-full max-w-[354px] flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-[28px] font-semibold leading-[140%] text-text-brand">
            Gamify your Campaign
          </h2>
          <p className="max-w-[320px] text-base leading-[140%] text-text-secondary">
            Enable gamification to start crafting your custom reward system.
          </p>
          <Button
            className="h-10 min-w-[220px] rounded-[10px] bg-action-primary px-6 text-sm font-medium text-white hover:bg-action-primary-hover"
            onClick={onEnableGamification}
          >
            Enable Gamification
          </Button>
        </div>
      </div>
    </section>
  )
}

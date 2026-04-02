import cardWaveBackground from '@/assets/landing/card-wave-bg.png'

interface FeatureCardProps {
  iconSrc: string
  title: string
  description: string
}

export function FeatureCard({ iconSrc, title, description }: FeatureCardProps) {
  return (
    <article className="relative h-[200px] overflow-hidden rounded-xl border border-border-primary bg-background-primary px-4 py-5 text-center shadow-[0_2px_12px_rgba(38,0,56,0.06)]">
      <img
        src={cardWaveBackground}
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 w-full object-cover"
      />

      <div className="relative flex h-full flex-col items-center">
        <img src={iconSrc} alt="" aria-hidden className="mb-4 h-16 w-16" />

        <h3 className="mb-2 text-base font-medium leading-[140%] text-text-primary">
          {title}
        </h3>
        <p className="max-w-[246px] text-sm leading-[140%] text-text-secondary">
          {description}
        </p>
      </div>
    </article>
  )
}

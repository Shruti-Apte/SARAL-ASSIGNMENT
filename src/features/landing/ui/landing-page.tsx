import { useAppDispatch } from '@/app/store/hooks'
import { openModal } from '@/features/reward-modal/model/reward-slice'
import { FeatureCard } from '@/features/landing/ui/components/feature-card'
import { HeroSection } from '@/features/landing/ui/components/hero-section'
import { LeftSidebar } from '@/features/landing/ui/components/left-sidebar'
import { TopNav } from '@/features/landing/ui/components/top-nav'
import { RewardModal } from '@/features/reward-modal/ui/reward-modal'

import iconAmbassadors from '@/assets/landing/icon-ambassadors.png'
import iconIncentives from '@/assets/landing/icon-incentives.png'
import iconMilestones from '@/assets/landing/icon-milestones.png'

const featureCards = [
  {
    title: 'Reward Your Ambassadors',
    description: 'Boost campaign performance by setting up rewards for ambassadors',
    iconSrc: iconAmbassadors,
  },
  {
    title: 'Set Milestones',
    description: 'Set up custom goals for sales, posts, or time-based achievements',
    iconSrc: iconMilestones,
  },
  {
    title: 'Customise Incentives',
    description: 'Create custom incentives like flat fees, free products, or special commissions.',
    iconSrc: iconIncentives,
  },
]

export function LandingPage() {
  const dispatch = useAppDispatch()

  return (
    <main className="min-h-screen bg-background-primary">
      <div className="mx-auto flex min-h-screen w-full flex-col md:flex-row">
        <LeftSidebar />

        <div className="mx-[11%] flex-1">
          <TopNav />

          <HeroSection
            onEnableGamification={() => {
              dispatch(openModal())
            }}
          />

          <section className="mx-auto grid w-full max-w-[924px] gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((card) => (
              <FeatureCard
                key={card.title}
                title={card.title}
                description={card.description}
                iconSrc={card.iconSrc}
              />
            ))}
          </section>
        </div>
      </div>

      <RewardModal />
    </main>
  )
}

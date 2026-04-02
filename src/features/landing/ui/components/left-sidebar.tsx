import {
  CreditCardIcon,
  FileTextIcon,
  HomeIcon,
  LightbulbIcon,
  SettingsIcon,
  SparklesIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'

const sidebarItems = [
  { id: 'home', label: 'Home', icon: HomeIcon, isEnabled: false },
  { id: 'insights', label: 'Insights', icon: LightbulbIcon, isEnabled: false },
  { id: 'gamification', label: 'Gamification', icon: SparklesIcon, isEnabled: true },
  { id: 'applications', label: 'Applications', icon: FileTextIcon, isEnabled: false },
  { id: 'payments', label: 'Payments', icon: CreditCardIcon, isEnabled: false },
]

export function LeftSidebar() {
  return (
    <aside className="w-full border-b border-border-primary bg-background-secondary md:flex md:min-h-screen md:w-[188px] md:flex-none md:flex-col md:justify-between md:border-r md:border-b-0">
      <div className="px-4 py-4">
        <div className="mb-5 flex items-center gap-2">
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-action-primary text-sm font-bold text-white">
            S
          </span>
          <p className="text-sm font-semibold tracking-wide text-text-primary">SATHI</p>
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = item.id === 'gamification'

            return (
              <button
                key={item.id}
                type="button"
                aria-disabled={!item.isEnabled}
                className={cn(
                  'inline-flex min-w-max items-center gap-2 rounded-[10px] px-3 py-2 text-sm transition md:w-full',
                  isActive
                    ? 'bg-background-tertiary text-action-primary'
                    : 'text-text-secondary hover:bg-background-primary',
                  item.isEnabled
                    ? 'cursor-default'
                    : 'cursor-not-allowed opacity-75'
                )}
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <div className="hidden px-4 py-5 md:block">
        <button
          type="button"
          className="inline-flex items-center gap-2 text-sm text-text-secondary"
          disabled
        >
          <SettingsIcon className="size-4" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  )
}

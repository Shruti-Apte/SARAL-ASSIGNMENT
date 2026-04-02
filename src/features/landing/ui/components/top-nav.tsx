import { BellIcon, UserCircle2Icon } from 'lucide-react'

export function TopNav() {
  return (
    <header className="mb-10 flex items-center justify-between py-4">
      <h1 className="text-xl font-medium text-text-primary">Gamification</h1>

      <div className="flex items-center gap-4 text-neutral-700">
        <button
          type="button"
          className="relative inline-flex items-center justify-center"
          aria-label="Notifications"
        >
          <BellIcon className="size-4" />
          <span className="absolute -top-1 -right-1 inline-flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-status-danger px-1 text-[10px] font-semibold leading-none text-white">
            5
          </span>
        </button>
        <UserCircle2Icon className="size-6" />
      </div>
    </header>
  )
}

import { Input } from '@/components/ui/input'

interface CurrencyInputFieldProps {
  value: string
  placeholder: string
  error?: string | null
  onChange: (nextValue: string) => void
}

export function CurrencyInputField({
  value,
  placeholder,
  error,
  onChange,
}: CurrencyInputFieldProps) {
  return (
    <div className="space-y-1">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-sm text-neutral-500">
          <span>$</span>
        </div>
        <Input
          value={value}
          onChange={(event) => {
            onChange(event.target.value)
          }}
          placeholder={placeholder}
          className="h-10 rounded-lg border-border-dropdown pl-7 text-base font-normal leading-[140%] focus-visible:border-action-primary focus-visible:ring-action-primary/25"
        />
      </div>
      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  )
}

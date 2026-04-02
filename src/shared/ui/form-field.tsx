import type { ReactNode } from 'react'

import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  helperText?: string
  htmlFor?: string
  className?: string
  children: ReactNode
}

export function FormField({
  label,
  required = false,
  error,
  helperText,
  htmlFor,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <Label
        htmlFor={htmlFor}
        className="text-sm font-normal leading-[140%] text-text-primary"
      >
        {label}
        {required ? <span className="text-action-primary"> *</span> : null}
      </Label>

      {children}

      {error ? (
        <p className="text-xs font-medium text-red-600">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-neutral-500">{helperText}</p>
      ) : null}
    </div>
  )
}

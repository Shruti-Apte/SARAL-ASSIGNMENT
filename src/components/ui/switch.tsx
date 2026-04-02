import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  checked,
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  const isChecked = checked === true
  const thumbTranslateClass =
    size === "sm"
      ? isChecked
        ? "translate-x-[12px]"
        : "translate-x-0"
      : isChecked
        ? "translate-x-[14px]"
        : "translate-x-0"

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "relative inline-flex shrink-0 items-center rounded-full border border-border-dropdown p-[2px] transition-colors duration-100 ease-out focus-visible:outline-none data-[size=default]:h-[20px] data-[size=default]:w-[34px] data-[size=sm]:h-[16px] data-[size=sm]:w-[28px] data-disabled:bg-[#cccccc] data-disabled:opacity-100",
        isChecked ? "bg-action-primary" : "bg-[#cccccc]",
        className
      )}
      checked={checked}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-white shadow-sm transition-transform duration-100 ease-out",
          size === "sm" ? "size-[10px]" : "size-[14px]",
          thumbTranslateClass
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }

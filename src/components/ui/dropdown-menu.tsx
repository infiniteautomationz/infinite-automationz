"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type DropdownContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownContext = React.createContext<DropdownContextValue | null>(null)

function useDropdownContext() {
  const context = React.useContext(DropdownContext)
  if (!context) throw new Error("DropdownMenu components must be used inside <DropdownMenu>")
  return context
}

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false)
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  )
}

const DropdownMenuTrigger = ({ asChild, children }: { asChild?: boolean; children: React.ReactElement }) => {
  const { setOpen } = useDropdownContext()
  if (asChild) {
    const child = children as React.ReactElement<{ onClick?: (event: React.MouseEvent<HTMLElement>) => void }>
    return React.cloneElement(child, {
      onClick: (event: React.MouseEvent<HTMLElement>) => {
        child.props.onClick?.(event)
        setOpen(true)
      },
    })
  }
  return (
    <button type="button" onClick={() => setOpen(true)}>
      {children}
    </button>
  )
}

const DropdownMenuContent = ({
  className,
  children,
}: {
  align?: "start" | "center" | "end"
  className?: string
  children: React.ReactNode
}) => {
  const { open, setOpen } = useDropdownContext()
  if (!open) return null
  return (
    <div
      className={cn(
        "absolute z-50 mt-2 min-w-[12rem] rounded-[var(--ia-radius-sm)] border border-[var(--ia-border)] bg-[var(--ia-bg-2)] p-1 text-[var(--ia-text)] shadow-[var(--ia-shadow-ambient)]",
        className,
      )}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
    </div>
  )
}

const DropdownMenuCheckboxItem = ({
  checked,
  onCheckedChange,
  className,
  children,
}: {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
  children: React.ReactNode
}) => (
  <DropdownMenuItem
    className={cn("justify-start gap-2", className)}
    onClick={() => onCheckedChange?.(!checked)}
  >
    <span className="inline-flex h-4 w-4 items-center justify-center rounded border border-[var(--ia-border)] text-xs text-[var(--ia-brand-gold-highlight)]">
      {checked ? "✓" : ""}
    </span>
    <span>{children}</span>
  </DropdownMenuItem>
)

const DropdownMenuItem = ({
  className,
  children,
  onClick,
}: {
  className?: string
  children: React.ReactNode
  onClick?: () => void
}) => {
  const { setOpen } = useDropdownContext()
  return (
    <button
      type="button"
      className={cn(
        "relative flex w-full items-center rounded-[var(--ia-radius-xs)] px-2 py-1.5 text-sm text-left outline-none transition-colors text-[var(--ia-text)] hover:bg-white/[0.08] hover:text-[var(--ia-text-strong)]",
        className,
      )}
      onClick={() => {
        onClick?.()
        setOpen(false)
      }}
    >
      {children}
    </button>
  )
}

const DropdownMenuRadioItem = DropdownMenuItem

const DropdownMenuLabel = ({
  className,
  children,
}: {
  inset?: boolean
  className?: string
  children: React.ReactNode
}) => <div className={cn("px-2 py-1.5 text-sm font-semibold", className)}>{children}</div>

const DropdownMenuSeparator = ({ className }: { className?: string }) => <div className={cn("my-1 h-px bg-white/[0.08]", className)} />

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />
)
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

const DropdownMenuGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>
const DropdownMenuPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>
const DropdownMenuSub = ({ children }: { children: React.ReactNode }) => <>{children}</>
const DropdownMenuSubContent = ({ children }: { children: React.ReactNode }) => <>{children}</>
const DropdownMenuSubTrigger = ({ children }: { children: React.ReactNode }) => <>{children}</>
const DropdownMenuRadioGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}

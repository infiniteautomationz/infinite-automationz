"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

type Option = { value: string; label: string }

type SelectContextValue = {
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  options: Option[]
}

const SelectContext = React.createContext<SelectContextValue>({ options: [] })

function textFromNode(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(textFromNode).join(" ")
  if (React.isValidElement(node)) {
    const element = node as React.ReactElement<{ children?: React.ReactNode }>
    return textFromNode(element.props.children)
  }
  return ""
}

function collectOptions(children: React.ReactNode): Option[] {
  const options: Option[] = []

  const visit = (node: React.ReactNode) => {
    React.Children.forEach(node, (child) => {
      if (!React.isValidElement(child)) return
      const maybeType = child.type as { displayName?: string }
      if (maybeType.displayName === "SelectItem") {
        const element = child as React.ReactElement<{ value: string; children?: React.ReactNode }>
        const value = String(element.props.value)
        const label = textFromNode(element.props.children).trim() || value
        options.push({ value, label })
      }
      const childElement = child as React.ReactElement<{ children?: React.ReactNode }>
      if (childElement.props?.children) visit(childElement.props.children)
    })
  }

  visit(children)
  return options
}

type SelectProps = {
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  children: React.ReactNode
}

const Select = ({ value, onValueChange, disabled, children }: SelectProps) => {
  const options = React.useMemo(() => collectOptions(children), [children])
  return (
    <SelectContext.Provider value={{ value, onValueChange, disabled, options }}>
      <div>{children}</div>
    </SelectContext.Provider>
  )
}

const SelectTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { value, onValueChange, disabled, options } = React.useContext(SelectContext)
    const { id, children: _children, ...wrapperProps } = props
    const triggerId = id ? String(id) : undefined
    return (
      <div ref={ref} className={cn("relative", className)} {...wrapperProps}>
        <select
          id={triggerId}
          value={value ?? options[0]?.value ?? ""}
          onChange={(event) => onValueChange?.(event.target.value)}
          disabled={disabled}
          className="h-10 w-full appearance-none rounded-[var(--ia-radius-sm)] border border-[var(--ia-border)] bg-black/30 pl-3 pr-9 text-sm text-[var(--ia-text-strong)] focus-visible:border-[var(--ia-border-gold)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ia-text-muted)]" />
      </div>
    )
  },
)
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = (_props: { placeholder?: string }) => null
const SelectContent = ({ children }: { className?: string; children: React.ReactNode }) => <>{children}</>
SelectContent.displayName = "SelectContent"

const SelectItem = ({ children }: { value: string; className?: string; children: React.ReactNode }) => <>{children}</>
SelectItem.displayName = "SelectItem"

const SelectGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>
const SelectLabel = ({ children }: { children: React.ReactNode }) => <>{children}</>
const SelectSeparator = () => null
const SelectScrollUpButton = () => null
const SelectScrollDownButton = () => null

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}

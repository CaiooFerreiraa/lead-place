"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
  options: { value: string; label: string }[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  className?: string
  icon?: React.ReactNode
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Selecione...",
  searchPlaceholder = "Pesquisar...",
  emptyMessage = "Nenhum resultado encontrado.",
  disabled = false,
  className,
  icon,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* @ts-ignore - Base UI PopoverTrigger type mismatch with shadcn Button */}
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={disabled}
          className={cn(
            "w-full justify-between bg-slate-50/50 border-slate-200/60 hover:bg-slate-100/80 transition-all duration-200 rounded-xl h-12 px-4 shadow-sm",
            className
          )}
        >
          <div className="flex items-center gap-2 truncate">
            {icon && <span className="shrink-0">{icon}</span>}
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {value
                ? options.find((option) => option.value === value)?.label
                : placeholder}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 rounded-xl border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden" align="start">
        <Command className="rounded-none border-none">
          {/* @ts-ignore - cmdk/shadcn compatibility in base-ui wrapper */}
          <CommandInput 
            placeholder={searchPlaceholder} 
            className="border-none focus:ring-0 outline-none"
          />
          <CommandList className="max-h-[300px] p-1">
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                   key={option.value}
                   value={option.label}
                   onSelect={() => {
                     onValueChange(option.value)
                     setOpen(false)
                   }}
                   className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-colors"
                >
                  <span className="flex-1 truncate">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

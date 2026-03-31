"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

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
import { Badge } from "@/components/ui/badge"

interface MultiComboboxProps {
  options: { value: string; label: string; group?: string }[]
  value: string[]
  onValueChange: (value: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  className?: string
  icon?: React.ReactNode
}

export function MultiCombobox({
  options,
  value,
  onValueChange,
  placeholder = "Selecione...",
  searchPlaceholder = "Pesquisar...",
  emptyMessage = "Nenhum resultado encontrado.",
  disabled = false,
  className,
  icon,
}: MultiComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const handleUnselect = (optionValue: string) => {
    onValueChange(value.filter((v) => v !== optionValue))
  }

  const handleSelect = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onValueChange(value.filter((v) => v !== optionValue))
    } else {
      onValueChange([...value, optionValue])
    }
  }

  // To group by 'group' property if available
  const groupedOptions = React.useMemo(() => {
    const groups: Record<string, { value: string; label: string }[]> = {}
    options.forEach((opt) => {
      const g = opt.group || "Outros"
      if (!groups[g]) groups[g] = []
      groups[g].push(opt)
    })
    return groups
  }, [options])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between bg-slate-50/50 border-slate-200/60 hover:bg-slate-100/80 transition-all duration-200 rounded-xl min-h-12 h-auto py-2 px-4 shadow-sm",
            className
          )}
        >
          <div className="flex flex-wrap gap-1 items-center truncate max-w-[90%]">
            {icon && <span className="shrink-0 mr-1">{icon}</span>}
            {value.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {value.map((val) => {
                  const option = options.find((o) => o.value === val)
                  return (
                    <Badge
                      key={val}
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-700 border-none px-2 py-0 h-6 flex items-center gap-1 text-[10px] uppercase font-bold"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleUnselect(val)
                      }}
                    >
                      {option?.label}
                      <X className="h-3 w-3 hover:text-emerald-900 cursor-pointer" />
                    </Badge>
                  )
                })}
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 rounded-xl border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden" align="start">
        <Command className="rounded-none border-none">
          <CommandInput 
            placeholder={searchPlaceholder} 
            className="border-none focus:ring-0 outline-none"
          />
          <CommandList className="max-h-[300px] p-1">
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            {Object.entries(groupedOptions).map(([group, groupOpts]) => (
              <CommandGroup key={group} heading={group !== "Outros" ? group : undefined}>
                {groupOpts.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => handleSelect(option.value)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-colors"
                  >
                    <span className="flex-1 truncate">{option.label}</span>
                    {value.includes(option.value) && (
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

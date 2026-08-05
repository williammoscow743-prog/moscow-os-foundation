import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useClients } from "./api";
import { clientDisplayName, matchesClientSearch } from "./utils";

type Props = {
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
};

/** Searchable selector for an existing client. Does not create clients. */
export function ClientSelect({ value, onChange, disabled }: Props) {
  const { data: clients = [], isLoading } = useClients();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = useMemo(() => clients.find((c) => c.id === value) ?? null, [clients, value]);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return clients;
    return clients.filter((c) => matchesClientSearch(c, q));
  }, [clients, query]);

  return (
    <div className="flex items-center gap-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full justify-between font-normal"
          >
            <span className={cn("truncate", !selected && "text-muted-foreground")}>
              {selected ? clientDisplayName(selected) : "No client"}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search clients…"
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              <CommandEmpty>{isLoading ? "Loading…" : "No clients found."}</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value="__none__"
                  onSelect={() => {
                    onChange(null);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", value ? "opacity-0" : "opacity-100")}
                  />
                  No client
                </CommandItem>
                {filtered.map((c) => (
                  <CommandItem
                    key={c.id}
                    value={c.id}
                    onSelect={() => {
                      onChange(c.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === c.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span className="truncate">{clientDisplayName(c)}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selected && !disabled && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Clear client"
          onClick={() => onChange(null)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

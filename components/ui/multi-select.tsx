"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface MultiSelectOption {
  id: string;
  name: string;
}

interface MultiSelectProps {
  label: string;
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  label,
  options,
  selected,
  onChange,
  placeholder = "Seçim yapın...",
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOptions = options.filter((option) => selected.includes(option.id));

  function toggleOption(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((item) => item !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  function removeOption(id: string, event: React.MouseEvent) {
    event.stopPropagation();
    onChange(selected.filter((item) => item !== id));
  }

  return (
    <div ref={containerRef} className="relative space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex min-h-10 w-full items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2 text-left text-sm",
          open && "ring-2 ring-primary/20",
        )}
      >
        <div className="flex flex-1 flex-wrap gap-1.5">
          {selectedOptions.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            selectedOptions.map((option) => (
              <span
                key={option.id}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs"
              >
                {option.name}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-600"
                  onClick={(event) => removeOption(option.id, event)}
                />
              </span>
            ))
          )}
        </div>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
          {options.length === 0 ? (
            <p className="p-3 text-sm text-muted-foreground">Seçenek bulunamadı.</p>
          ) : (
            options.map((option) => {
              const isSelected = selected.includes(option.id);
              return (
                <label
                  key={option.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 border-b border-border px-3 py-2.5 text-sm last:border-b-0 hover:bg-muted",
                    isSelected && "bg-muted/70",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleOption(option.id)}
                    className="h-4 w-4 rounded border-border accent-primary"
                  />
                  <span>{option.name}</span>
                </label>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

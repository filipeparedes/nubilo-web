interface FilterBarProps {
  value: string;
  onChange: (value: string) => void;
  // How many objects match the filter.
  count: number;
}

// The box above a listing that narrows it as you type.
export function FilterBar({ value, onChange, count }: FilterBarProps) {
  return (
    <div className="flex h-[34px] items-center gap-2 border border-b-0 border-line px-2 text-accent-dim">
      <label htmlFor="filter">FILTER:</label>
      <input
        id="filter"
        className="min-w-20 flex-1 border-0 bg-transparent text-fg outline-0"
        placeholder="type to narrow listing_"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <span className="text-[10px] text-muted">{count} OBJECTS</span>
    </div>
  );
}

interface FilterNumberInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  className?: string;
}

export const FilterNumberInput = ({
    value,
    onChange,
    placeholder,
    className = ''
}:FilterNumberInputProps) => {
    return (
        <input
            type="number"
            placeholder={placeholder}
            value={value ?? ''}
            onChange={(e) => {
                const val = e.target.value;
                onChange(val ? Number(val) : null);
            }}
            className={`w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white placeholder-brand-muted focus:outline-none focus:border-brand-accent/50 ${className}`}
        />
    );
};
/**
 * QuantityStepper - Controlled Component
 * 
 * In React, a controlled component does not keep its own internal state.
 * Instead:
 * 1. It receives its current value via the `value` prop.
 * 2. It notifies the parent of changes via the `onChange(newValue)` prop.
 * 3. The parent component manages the source of truth with `useState`.
 */
export default function QuantityStepper({
  value = 0,
  onChange,
  min = 0,
  max = 10,
  label = 'Quantity',
}) {
  const handleDecrement = (e) => {
    e.stopPropagation();
    if (value > min && onChange) {
      onChange(value - 1);
    }
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    if (value < max && onChange) {
      onChange(value + 1);
    }
  };

  return (
    <div
      className="inline-flex items-center rounded-full bg-white/90 border border-black/10 shadow-sm p-1 gap-1"
      role="group"
      aria-label={label}
    >
      {/* Decrement Button */}
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-aura-accent/50 ${
          value <= min
            ? 'text-aura-muted/40 cursor-not-allowed bg-transparent'
            : 'text-aura-primary hover:bg-black/5 active:scale-95'
        }`}
        aria-label="Decrease quantity"
      >
        <span className="sr-only">Decrease</span>
        &minus;
      </button>

      {/* Numeric Value Display */}
      <span
        className="w-7 text-center font-serif text-sm font-semibold text-aura-primary select-none tabular-nums"
        aria-live="polite"
      >
        {value}
      </span>

      {/* Increment Button */}
      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-aura-accent/50 ${
          value >= max
            ? 'text-aura-muted/40 cursor-not-allowed bg-transparent'
            : 'text-aura-primary hover:bg-black/5 active:scale-95'
        }`}
        aria-label="Increase quantity"
      >
        <span className="sr-only">Increase</span>
        &#43;
      </button>
    </div>
  );
}

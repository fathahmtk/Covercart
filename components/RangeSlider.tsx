import React, { useState, useEffect, useRef, useCallback } from 'react';

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  value: { min: number; max: number };
  onChange: (value: { min: number; max: number }) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ min, max, step, value, onChange }) => {
  const [minValue, setMinValue] = useState(value.min);
  const [maxValue, setMaxValue] = useState(value.max);
  const rangeRef = useRef<HTMLDivElement>(null);

  // Update internal state if props change
  useEffect(() => {
    setMinValue(value.min);
    setMaxValue(value.max);
  }, [value]);

  const getPercent = useCallback(
    (val: number) => Math.round(((val - min) / (max - min)) * 100),
    [min, max]
  );

  useEffect(() => {
    if (rangeRef.current) {
      const minPercent = getPercent(minValue);
      const maxPercent = getPercent(maxValue);

      rangeRef.current.style.setProperty('--min-percent', `${minPercent}%`);
      rangeRef.current.style.setProperty('--max-percent', `${maxPercent}%`);
    }
  }, [minValue, maxValue, getPercent]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinVal = Math.min(Number(e.target.value), maxValue - step);
    setMinValue(newMinVal);
    onChange({ min: newMinVal, max: maxValue });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMaxVal = Math.max(Number(e.target.value), minValue + step);
    setMaxValue(newMaxVal);
    onChange({ min: minValue, max: newMaxVal });
  };

  return (
    <div className="relative w-full h-10 flex items-center">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minValue}
        onChange={handleMinChange}
        className="thumb thumb--left"
        aria-label="Minimum price"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxValue}
        onChange={handleMaxChange}
        className="thumb thumb--right"
        aria-label="Maximum price"
      />

      <div className="relative w-full">
        <div className="absolute w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full z-0" />
        <div
          ref={rangeRef}
          className="absolute h-1 bg-[--color-primary] rounded-full z-1"
          style={{ left: `var(--min-percent, 0%)`, right: `calc(100% - var(--max-percent, 100%))` }}
        />
      </div>

      <style>{`
        .thumb {
          pointer-events: none;
          position: absolute;
          height: 0;
          width: 100%;
          outline: none;
          z-index: 2;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-color: transparent;
        }

        .thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          pointer-events: all;
          width: 1.25rem;
          height: 1.25rem;
          background-color: var(--color-primary);
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .dark .thumb::-webkit-slider-thumb {
            border-color: var(--color-bg-subtle);
        }

        .thumb::-moz-range-thumb {
          -moz-appearance: none;
          pointer-events: all;
          width: 1.25rem;
          height: 1.25rem;
          background-color: var(--color-primary);
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .dark .thumb::-moz-range-thumb {
            border-color: var(--color-bg-subtle);
        }
      `}</style>
    </div>
  );
};

export default RangeSlider;

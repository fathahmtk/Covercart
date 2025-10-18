import React from 'react';
import { CheckIcon } from './icons/CheckIcon';

interface ProductFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: { min: number, max: number };
  onPriceChange: (newRange: { min: number, max: number }) => void;
  maxPrice: number;
  sortOptions: { value: string, label: string }[];
  selectedSort: string;
  onSortChange: (sortValue: string) => void;
  availableColors: string[];
  selectedColors: string[];
  onColorChange: (colors: string[]) => void;
  onReset: () => void;
  resultCount: number;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  maxPrice,
  sortOptions,
  selectedSort,
  onSortChange,
  availableColors,
  selectedColors,
  onColorChange,
  onReset,
  resultCount,
}) => {

  const handlePriceSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPriceChange({ ...priceRange, max: parseInt(e.target.value, 10) });
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value);
  }

  const handleColorClick = (color: string) => {
    const newSelectedColors = selectedColors.includes(color)
      ? selectedColors.filter(c => c !== color)
      : [...selectedColors, color];
    onColorChange(newSelectedColors);
  };

  const isColorLight = (hexColor: string) => {
    const color = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor;
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5;
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg mb-12 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
        {/* Category Filter */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Category</h4>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-teal-600 text-white shadow'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div className="col-span-1 md:col-span-1 lg:col-span-2">
          <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Max Price: <span className="font-bold text-teal-600 dark:text-teal-400">₹{priceRange.max}</span></h4>
          <input
            type="range"
            min="0"
            max={maxPrice}
            step="50"
            value={priceRange.max}
            onChange={handlePriceSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            aria-label="Price range slider"
          />
        </div>

        {/* Color Filter */}
        <div className="col-span-1 md:col-span-1 lg:col-span-2">
          <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Color</h4>
          <div className="flex flex-wrap gap-3">
            {availableColors.map(color => {
              const isSelected = selectedColors.includes(color);
              const checkmarkColor = isColorLight(color) ? 'text-gray-800' : 'text-white';
              return (
                <button
                  key={color}
                  onClick={() => handleColorClick(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${isSelected ? 'border-teal-500 ring-2 ring-teal-500 ring-offset-1' : 'border-gray-300 dark:border-gray-500'}`}
                  style={{ backgroundColor: color }}
                  aria-label={`Filter by color ${color}`}
                  title={color}
                >
                  {isSelected && <CheckIcon className={`w-5 h-5 ${checkmarkColor}`} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="col-span-1 md:col-span-1 lg:col-span-2">
          <label htmlFor="sort-by" className="block font-semibold mb-3 text-gray-700 dark:text-gray-300">Sort by</label>
          <select
            id="sort-by"
            value={selectedSort}
            onChange={handleSortChange}
            className="w-full max-w-xs p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Filter Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
         <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-bold text-gray-800 dark:text-white">{resultCount}</span> products
        </p>
        <button
          onClick={onReset}
          className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;
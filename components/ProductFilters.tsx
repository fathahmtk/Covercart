import React, { useState } from 'react';
import { CheckIcon } from './icons/CheckIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import RangeSlider from './RangeSlider';

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

// Helper component for a consistent collapsible section UI
const FilterSection: React.FC<{ title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode }> = ({ title, isOpen, onToggle, children }) => {
  return (
    <div className="border-b border-[--color-border] last:border-b-0">
      <button 
        onClick={onToggle} 
        className="w-full flex justify-between items-center py-4 font-semibold text-[--color-text] hover:bg-[--color-bg-subtle]/50 rounded-md px-2 -mx-2"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${!isOpen ? '-rotate-90' : ''}`} />
      </button>
      <div className={`transition-[max-height,padding-bottom] duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px] pb-4' : 'max-h-0'}`}>
        {children}
      </div>
    </div>
  );
};


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
  const [openSections, setOpenSections] = useState({ category: true, price: true, color: true });

  const toggleSection = (section: 'category' | 'color' | 'price') => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
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
    <div className="bg-[--color-bg] p-6 rounded-lg mb-12 shadow-md border border-[--color-border]">
      {/* Top Row: Title & Sorting */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
        <h3 className="text-2xl font-bold text-[--color-text]">Filters</h3>
        <div className="flex items-center gap-2 mt-3 sm:mt-0">
          <label htmlFor="sort-by" className="text-sm font-medium text-[--color-text-muted] whitespace-nowrap">Sort by:</label>
          <select
            id="sort-by"
            value={selectedSort}
            onChange={handleSortChange}
            className="w-full sm:w-auto p-2 border border-[--color-border] rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[--color-primary] focus:border-[--color-primary]"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Main Filters Area */}
      <div>
        <FilterSection title="Category" isOpen={openSections.category} onToggle={() => toggleSection('category')}>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-[--color-primary] text-white shadow'
                    : 'bg-[--color-bg-subtle] dark:bg-gray-700 text-[--color-text-muted] hover:bg-teal-100 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Price Range" isOpen={openSections.price} onToggle={() => toggleSection('price')}>
          <div className="px-2">
            <div className="flex justify-between items-center text-sm font-bold text-[--color-primary] mb-2">
                <span>₹{priceRange.min}</span>
                <span>₹{priceRange.max}</span>
            </div>
            <RangeSlider
              min={0}
              max={maxPrice}
              step={50}
              value={priceRange}
              onChange={onPriceChange}
            />
          </div>
        </FilterSection>

        <FilterSection title="Color" isOpen={openSections.color} onToggle={() => toggleSection('color')}>
          <div className="flex flex-wrap gap-3">
            {availableColors.map(color => {
              const isSelected = selectedColors.includes(color);
              const checkmarkColor = isColorLight(color) ? 'text-gray-800' : 'text-white';
              return (
                <button
                  key={color}
                  onClick={() => handleColorClick(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${isSelected ? 'border-[--color-primary] ring-2 ring-[--color-primary] ring-offset-1' : 'border-gray-300 dark:border-gray-500'}`}
                  style={{ backgroundColor: color }}
                  aria-label={`Filter by color ${color}`}
                  title={color}
                >
                  {isSelected && <CheckIcon className={`w-5 h-5 ${checkmarkColor}`} />}
                </button>
              );
            })}
          </div>
        </FilterSection>
      </div>

      {/* Bottom Row: Results & Reset */}
      <div className="mt-6 pt-4 border-t border-[--color-border] flex justify-between items-center">
        <p className="text-sm font-semibold text-[--color-text-muted]">
          {resultCount} Product{resultCount !== 1 && 's'} Found
        </p>
        <button
          onClick={onReset}
          className="text-sm font-semibold text-white bg-[--color-primary] hover:bg-[--color-primary-hover] px-4 py-2 rounded-full transition-colors shadow-sm"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;
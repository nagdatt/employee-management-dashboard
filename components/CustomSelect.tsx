import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface Option {
  value: string;
  label: string;
  icon?: React.ElementType;
}

interface CustomSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  error?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select option',
  className = '',
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
      <button
        type="button"
        className={`w-full bg-white border rounded-lg shadow-sm pl-3 pr-10 py-2.5 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm relative text-slate-900 transition-all duration-200 ${
          error ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 hover:border-blue-400'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center truncate">
          {selectedOption?.icon && (
            <selectedOption.icon className="flex-shrink-0 h-4 w-4 text-slate-500 mr-2" />
          )}
          <span className={`block truncate ${!selectedOption ? 'text-slate-500' : ''}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} aria-hidden="true" />
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white shadow-xl max-h-60 rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm animate-in fade-in zoom-in-95 duration-100 origin-top">
          {options.map((option) => (
            <div
              key={option.value}
              className={`cursor-pointer select-none relative py-2.5 pl-3 pr-9 hover:bg-blue-50 text-slate-900 transition-colors ${
                value === option.value ? 'bg-blue-50 text-blue-700 font-medium' : ''
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              <div className="flex items-center">
                {option.icon && (
                  <option.icon
                    className={`flex-shrink-0 h-4 w-4 mr-2 ${
                      value === option.value ? 'text-blue-600' : 'text-slate-400'
                    }`}
                  />
                )}
                <span className={`block truncate`}>
                  {option.label}
                </span>
              </div>

              {value === option.value && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default CustomSelect;
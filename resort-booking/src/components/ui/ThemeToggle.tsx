import React from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      title={theme === 'light' ? 'Dark mode' : 'Light mode'}
      className="inline-flex items-center justify-center h-11 w-11 rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-all duration-300 hover:border-airbnb-red hover:text-airbnb-red hover:-translate-y-0.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-airbnb-red dark:hover:text-airbnb-red"
    >
      {theme === 'light' ? (
        <MoonIcon className="h-5 w-5" />
      ) : (
        <SunIcon className="h-5 w-5" />
      )}
    </button>
  );
};

export default ThemeToggle;

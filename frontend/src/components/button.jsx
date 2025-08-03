import React from 'react';

/**
 * An object mapping color names to their corresponding Tailwind CSS class strings.
 *
 * @type {Object.<string, string>}
 * @property {string} blue - Applies a blue background with white text.
 * @property {string} red - Applies a red background with white text.
 * @property {string} green - Applies a green background with white text.
 * @property {string} yellow - Applies a yellow background with black text.
 * @property {string} textBlue - Applies blue text color.
 * @property {string} textRed - Applies red text color.
 */
const colorClasses = {
  blue: 'bg-blue-600 text-white',
  red: 'bg-red-600 text-white',
  green: 'bg-green-600 text-white',
  yellow: 'bg-yellow-400 text-black',
  textBlue: 'text-blue-600',
  textRed: 'text-red-600',
};

const Button = ({ color = 'blue', className = '', ...props }) => (
  <button
    className={`${colorClasses[color] || ''} px-4 py-2 rounded transition-shadow hover:shadow-md ${className}`}
    {...props}
  />
);

export default Button;
import React, { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  glass = true,
  hoverEffect = false,
  className = '',
  ...props
}) => {
  const baseStyle = glass
    ? 'glass-card rounded-2xl p-6'
    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm';
  
  const hoverStyle = hoverEffect
    ? 'hover:-translate-y-1 hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300'
    : '';

  return (
    <div className={`${baseStyle} ${hoverStyle} ${className}`} {...props}>
      {children}
    </div>
  );
};

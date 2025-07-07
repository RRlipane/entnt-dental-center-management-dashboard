
import React from 'react';
import classNames from 'classnames';

type InputSize    = 'sm' | 'md' | 'lg';
type InputVariant = 'outline' | 'filled' | 'flushed';

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: InputSize;
  variant?: InputVariant;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      size = 'md',
      variant = 'outline',
      startAdornment,
      endAdornment,
      fullWidth = false,
      id,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId =
      id || props.name || `input-${Math.random().toString(36).slice(2, 11)}`;

    
    const sizeClasses: Record<InputSize, string> = {
      sm: 'py-1 px-2 text-sm',
      md: 'py-2 px-3 text-base',
      lg: 'py-3 px-4 text-lg',
    };

    const variantClasses: Record<InputVariant, string> = {
      outline: classNames(
        'border bg-transparent',
        error
          ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
      ),
      filled: classNames(
        'bg-gray-50 border-b',
        error
          ? 'border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
      ),
      flushed: classNames(
        'bg-transparent border-b',
        error
          ? 'border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
      ),
    };

   
    return (
      <div className={classNames('flex flex-col gap-1', { 'w-full': fullWidth })}>
        {label && (
          <label
            htmlFor={inputId}
            className={classNames('font-medium', {
              'text-gray-700': !error && !disabled,
              'text-red-600': error,
              'text-gray-400': disabled,
            })}
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {startAdornment && (
            <span className="absolute left-3 flex items-center justify-center">
              {startAdornment}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={classNames(
              'rounded-md focus:outline-none focus:ring-1 transition-colors duration-200',
              sizeClasses[size],
              variantClasses[variant],
              {
                'pl-10': startAdornment,
                'pr-10': endAdornment,
                'w-full': fullWidth,
                'opacity-70 cursor-not-allowed': disabled,
              },
              className
            )}
            {...props}
          />

          {endAdornment && (
            <span className="absolute right-3 flex items-center justify-center">
              {endAdornment}
            </span>
          )}
        </div>

        {(error || helperText) && (
          <span
            id={`${inputId}-error`}
            className={classNames('text-sm', {
              'text-red-600': error,
              'text-gray-500': !error,
            })}
          >
            {error || helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

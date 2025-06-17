import React from 'react'

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const base = 'rounded-xl font-semibold transition duration-200 focus:outline-none'

  const variants = {
    primary: 'bg-ediblue text-white hover:bg-ediblueLight',
    secondary: 'bg-edigray text-ediblue hover:bg-gray-300',
    text: 'bg-transparent text-ediblue hover:underline',
  }

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-5 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : ''

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
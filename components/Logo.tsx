import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-label="InsureOS Logo"
    >
      <path 
        d="M32.5 32.5C25 40 25 50 32.5 57.5L42.5 67.5C50 75 60 75 67.5 67.5C75 60 75 50 67.5 42.5L57.5 32.5C50 25 40 25 32.5 32.5Z" 
        stroke="currentColor" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M67.5 32.5C75 40 75 50 67.5 57.5L57.5 67.5C50 75 40 75 32.5 67.5C25 60 25 50 32.5 42.5L42.5 32.5C50 25 60 25 67.5 32.5Z" 
        stroke="currentColor" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Logo;
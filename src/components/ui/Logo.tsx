import React from 'react';

export const MiyarLogo = ({ className }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Shield Shape (Subtle) */}
      <path 
        d="M50 5L85 20V50C85 75 50 95 50 95C50 95 15 75 15 50V20L50 5Z" 
        fill="#1A2B3C" 
        fillOpacity="0.05"
      />
      
      {/* The "M" & "Scale" Architectural Structure */}
      <path 
        d="M30 75V35L50 55L70 35V75" 
        stroke="#1A2B3C" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* The "Standard" Base Line */}
      <path 
        d="M25 85H75" 
        stroke="#C5A059" 
        strokeWidth="3" 
        strokeLinecap="round"
      />
      
      {/* The Human/Decision Point */}
      <circle cx="50" cy="25" r="10" fill="#C5A059" />
      
      {/* Precision Markers */}
      <path d="M50 65V75" stroke="#C5A059" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

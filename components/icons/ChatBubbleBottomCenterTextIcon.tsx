
import React from 'react';

export const ChatBubbleBottomCenterTextIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg 
        className={className} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.53-.388A.75.75 0 018.98 20.1a8.25 8.25 0 00-4.33-2.42.75.75 0 01-.13-1.41a7.46 7.46 0 01-1.33-3.61c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" 
        />
    </svg>
);

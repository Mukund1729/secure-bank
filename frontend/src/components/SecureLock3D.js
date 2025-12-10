import React from 'react';
import './ThreeDAnimation.css';

const SecureLock3D = () => {
  return (
    <div className="three-d-animation three-d-animation--compact secure-lock-illustration">
      <svg
        viewBox="0 0 320 220"
        xmlns="http://www.w3.org/2000/svg"
        className="secure-lock-svg"
      >
        {/* soft background */}
        <defs>
          <linearGradient id="lockBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f3f4ff" />
          </linearGradient>
          <linearGradient id="lockBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="lockMetal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e5e7eb" />
            <stop offset="100%" stopColor="#cbd5f5" />
          </linearGradient>
          <linearGradient id="keyMetal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="320" height="220" fill="url(#lockBg)" rx="24" />

        {/* platform shadow */}
        <ellipse cx="160" cy="178" rx="110" ry="26" fill="#d4d4d8" opacity="0.8" />

        {/* shackle */}
        <path
          d="M115 96 C115 64 145 46 160 46 C175 46 205 64 205 96 L193 96 C193 72 174 60 160 60 C146 60 127 72 127 96 Z"
          fill="url(#lockMetal)"
        />

        {/* lock body */}
        <rect
          x="110"
          y="90"
          width="104"
          height="86"
          rx="18"
          fill="url(#lockBody)"
        />

        {/* key group */}
        <g className="secure-lock-key">
          {/* key stem */}
          <rect x="70" y="122" width="80" height="8" rx="4" fill="url(#keyMetal)" />

          {/* key teeth */}
          <rect x="106" y="130" width="16" height="18" rx="3" fill="url(#keyMetal)" />

          {/* key ring */}
          <circle cx="60" cy="126" r="16" fill="none" stroke="url(#keyMetal)" strokeWidth="6" />
          <circle cx="60" cy="126" r="9" fill="none" stroke="rgba(248, 250, 252, 0.25)" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
};

export default SecureLock3D;

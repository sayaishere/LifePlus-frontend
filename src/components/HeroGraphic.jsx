import React from 'react';

export function HeroGraphic() {
    return (
        <div className="relative w-64 h-40 flex items-center justify-center opacity-80 select-none pointer-events-none">
            <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                    {/* Dark red glow gradient for the droplet */}
                    <radialGradient id="dropGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </radialGradient>

                    {/* Gradient for the ECG pulse line */}
                    <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.1" />
                        <stop offset="50%" stopColor="#f87171" stopOpacity="1" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0.2" />
                    </linearGradient>
                </defs>

                {/* Soft Red Backlight Glow */}
                <circle cx="100" cy="100" r="80" fill="url(#dropGlow)" />

                {/* Large Background Blood Drop Overlay */}
                <path
                    d="M100 25 C100 25, 145 90, 145 125 A45 45 0 0 1 55 125 C55 90, 100 25, 100 25 Z"
                    fill="#b91c1c"
                    fillOpacity="0.22"
                />

                {/* ECG Heartbeat (Beep) Pulse Line across the droplet */}
                <path
                    d="M 10 115 H 65 L 73 100 L 82 135 L 96 75 L 110 145 L 122 105 L 130 115 H 190"
                    fill="none"
                    stroke="url(#pulseGradient)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}

export default HeroGraphic;
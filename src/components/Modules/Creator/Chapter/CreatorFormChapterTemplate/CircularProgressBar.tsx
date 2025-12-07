import React from 'react';

interface CircularProgressBarProps {
    progress: number; // 0-100
    size?: number;
    strokeWidth?: number;
    className?: string;
}

export const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
    progress,
    size = 48,
    strokeWidth = 5,
    className = '',
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <svg width={size} height={size} className={className}>
            <circle
                stroke="currentColor"
                className="text-gray-300"
                strokeWidth={strokeWidth}
                fill="transparent"
                r={radius}
                cx={size / 2}
                cy={size / 2}
            />
            <circle
                stroke="currentColor"
                className="text-blue-500 transition-all duration-300"
                strokeWidth={strokeWidth}
                fill="transparent"
                r={radius}
                cx={size / 2}
                cy={size / 2}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
            <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                className="text-[12px] fill-blue-500 font-semibold"
            >
                {Math.round(progress)}%
            </text>
        </svg>
    );
};

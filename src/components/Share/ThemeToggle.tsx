"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
    className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`p-2 rounded-lg bg-muted hover:bg-muted-foreground transition-colors ${className}`}
            title={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
        >
            {isDark ? (
                <svg
                    className="w-5 h-5 text-foreground"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-2.83-2.83a1 1 0 00-1.414 1.414l2.83 2.83a1 1 0 001.414-1.414zM2.05 6.464l2.83 2.83a1 1 0 001.414-1.414L3.464 5.05A1 1 0 102.05 6.464zm9.9-1.414l2.83-2.83a1 1 0 00-1.414-1.414l-2.83 2.83a1 1 0 001.414 1.414zM17.95 13.536l-2.83-2.83a1 1 0 00-1.414 1.414l2.83 2.83a1 1 0 001.414-1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1zm14 0a1 1 0 100-2h-1a1 1 0 100 2h1z"
                        clipRule="evenodd"
                    />
                </svg>
            ) : (
                <svg
                    className="w-5 h-5 text-foreground"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
            )}
        </button>
    );
}

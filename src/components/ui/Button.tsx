import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";
import IconSpinner from "../Modules/Icons/IconSpinner";

const buttonStyles = cva(
    "border rounded transition inline-flex items-center justify-center w-full",
    {
        variants: {
            intent: {
                primary: "text-foreground bg-primary rounded-md border-transparent",
                secondary: "bg-background text-foreground border-border",
            },
            size: {
                small: "text-sm h-6 leading-6 px-3",
                medium: "text-base h-10 leading-10 px-3",
            },
            disabled: {
                true: "opacity-50 pointer-events-none",
                false: null,
            },
        },
        compoundVariants: [
            {
                intent: "primary",
                disabled: false,
                class: "hover:bg-primary/80",
            },
            {
                intent: "secondary",
                disabled: false,
                class: "hover:bg-muted",
            },
            {
                intent: "primary",
                size: "medium",
                class: "",
            },
        ],
        defaultVariants: {
            intent: "primary",
            size: "medium",
            disabled: false,
        },
    }
);

type ButtonVariants = VariantProps<typeof buttonStyles>;

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        Omit<ButtonVariants, "disabled"> {
    disabled?: boolean;
    loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    intent,
    size,
    disabled = false,
    loading = false,
    className,
    children,
    ...props
}) => {
    const isDisabled = disabled || loading;

    const spinnerSizeClass = size === "small" ? "w-2 h-2" : "w-4 h-4";

    return (
        <button
            className={cn(
                buttonStyles({ intent, size, disabled: isDisabled, className })
            )}
            disabled={isDisabled}
            {...props}
        >
            {loading ? (
                <IconSpinner
                    className={`${spinnerSizeClass} animate-spin fill-white`}
                />
            ) : (
                children
            )}
        </button>
    );
};

export default Button;

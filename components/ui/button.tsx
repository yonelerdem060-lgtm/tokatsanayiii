import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "default" | "primary" | "secondary" | "outline" | "ghost" | "destructive" | "whatsapp";
type ButtonSize = "default" | "sm" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variants: Record<ButtonVariant, string> = {
  default:
    "bg-primary text-primary-foreground shadow-sm hover:brightness-110",
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:brightness-110",
  secondary:
    "border border-border bg-white text-foreground hover:bg-primary-soft hover:border-blue-200",
  outline: "border border-border bg-white/90 hover:bg-primary-soft hover:border-blue-200",
  ghost: "hover:bg-primary-soft",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  whatsapp:
    "border border-emerald-200 bg-success-soft text-emerald-800 hover:bg-emerald-100",
};

const sizes: Record<ButtonSize, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-8 px-3 text-sm",
  lg: "h-11 px-6",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[var(--ds-radius-lg)] text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";

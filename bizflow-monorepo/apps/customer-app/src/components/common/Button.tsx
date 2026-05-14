import { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
  children: ReactNode;
}

const variants = {
  primary: "bg-amber-600 text-white hover:bg-amber-700 active:bg-amber-800",
  secondary: "bg-stone-200 text-stone-900 hover:bg-stone-300",
  ghost: "bg-transparent text-stone-700 hover:bg-stone-100",
};

export const Button = ({
  variant = "primary",
  fullWidth,
  children,
  className = "",
  ...rest
}: Props) => (
  <button
    {...rest}
    className={`px-4 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
  >
    {children}
  </button>
);

import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export const Badge = ({ children, className = "" }: Props) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}
  >
    {children}
  </span>
);

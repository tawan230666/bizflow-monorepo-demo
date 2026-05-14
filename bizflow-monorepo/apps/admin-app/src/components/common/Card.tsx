import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: Props) => (
  <div
    className={`bg-white rounded-2xl shadow-sm border border-slate-200 ${className}`}
  >
    {children}
  </div>
);

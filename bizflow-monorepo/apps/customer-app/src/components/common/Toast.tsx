import { useEffect, useState } from "react";

type ToastType = "success" | "error" | "info";

interface ToastState {
  message: string;
  type: ToastType;
}

let listeners: ((t: ToastState | null) => void)[] = [];

export const toast = {
  success: (msg: string) => emit({ message: msg, type: "success" }),
  error: (msg: string) => emit({ message: msg, type: "error" }),
  info: (msg: string) => emit({ message: msg, type: "info" }),
};

const emit = (t: ToastState) => listeners.forEach((l) => l(t));

const typeStyles: Record<ToastType, string> = {
  success: "bg-green-600",
  error: "bg-red-600",
  info: "bg-stone-800",
};

export const ToastContainer = () => {
  const [current, setCurrent] = useState<ToastState | null>(null);

  useEffect(() => {
    listeners.push(setCurrent);
    return () => {
      listeners = listeners.filter((l) => l !== setCurrent);
    };
  }, []);

  useEffect(() => {
    if (!current) return;
    const timer = setTimeout(() => setCurrent(null), 2500);
    return () => clearTimeout(timer);
  }, [current]);

  if (!current) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`${typeStyles[current.type]} text-white px-4 py-2 rounded-xl shadow-lg text-sm`}
      >
        {current.message}
      </div>
    </div>
  );
};

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, symbol = "$") {
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  
  if (absValue >= 1e6) {
    return `${isNegative ? "-" : ""}${symbol}${(absValue / 1e6).toFixed(2)}M`;
  }
  if (absValue >= 1e3) {
    return `${isNegative ? "-" : ""}${symbol}${(absValue / 1e3).toFixed(2)}K`;
  }
  
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return `${isNegative ? "-" : ""}${symbol}${formatter.format(absValue)}`;
}

export function formatCurrencyExact(value: number, symbol = "$") {
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${isNegative ? "-" : ""}${symbol}${formatter.format(absValue)}`;
}

import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent text-primary ",
        secondary: "border-transparent text-primary hover:bg-green-700",
        destructive:
          "border-transparent bg-red-800 text-white hover:bg-red-900",
        outline:
          "border border-brand-red bg-white text-brand-red hover:bg-brand-red hover:text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

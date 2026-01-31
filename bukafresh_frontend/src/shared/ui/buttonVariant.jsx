import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg",

        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",

        outline:
          "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",

        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",

        ghost:
          "hover:bg-accent hover:text-accent-foreground",

        link:
          "text-primary underline-offset-4 hover:underline font-medium",

        hero:
          "bg-gradient-hero text-white font-semibold shadow-card hover:shadow-elevated hover:scale-105 transform transition-all",

        premium:
          "bg-gradient-premium text-white font-semibold shadow-card hover:shadow-elevated border border-accent/20",

        banking:
          "bg-gradient-to-r from-[#005AFF] to-[#0044cc] text-white font-bold shadow-lg hover:shadow-xl",

        "banking-outline":
          "border-2 border-[#005AFF] text-[#005AFF] hover:bg-[#005AFF] hover:text-white font-medium transition-all",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
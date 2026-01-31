import { cva } from "class-variance-authority";

const privacyButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-primary text-primary-foreground hover:shadow-button hover:scale-105 transform transition-all duration-200",
        outline:
          "border-2 border-banking-primary text-banking-primary hover:bg-banking-primary hover:text-white transition-all duration-200",
        secondary:
          "bg-banking-gray-medium text-banking-gray-dark hover:bg-banking-gray-dark hover:text-white transition-all duration-200",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
export default privacyButtonVariants;

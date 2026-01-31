import React from "react";
import { cn } from "../utils/cn";
import privacyButtonVariants from "./privacy-buttonVariant";

const PrivacyButton = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(privacyButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

PrivacyButton.displayName = "PrivacyButton";

export { PrivacyButton };

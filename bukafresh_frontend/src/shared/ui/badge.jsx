import * as React from "react";
import { badgeVariants } from "./badgeVariant";
import { cn } from "../utils/cn";

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge };

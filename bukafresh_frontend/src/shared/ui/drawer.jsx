import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@shared/utils/cn";

export function Drawer({ open, onOpenChange, children }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog.Root>
  );
}

export const DrawerTrigger = Dialog.Trigger;
export const DrawerTitle = Dialog.Title;
export const DrawerDescription = Dialog.Description;
export const DrawerFooter = Dialog.Footer;

export function DrawerContent({
  side = "right",
  title,
  description,
  footer,
  className,
  children,
}) {
  return (
    <Dialog.Portal>
      {/* Overlay */}
      <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />

      {/* Drawer panel */}
      <Dialog.Content
        className={cn(
          "fixed z-50 bg-white shadow-xl flex flex-col transition-transform duration-300 ease-in-out",
          side === "right" && "top-0 right-0 h-full w-96",
          side === "left" && "top-0 left-0 h-full w-96",
          side === "bottom" && "bottom-0 left-0 w-full h-96",
          side === "top" && "top-0 left-0 w-full h-96",
          className
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="p-4 border-b space-y-1">
            {title && (
              <DrawerTitle className="font-semibold text-lg">
                {title}
              </DrawerTitle>
            )}
            {description && (
              <DrawerDescription className="text-sm text-gray-500">
                {description}
              </DrawerDescription>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>

        {/* Footer */}
        <DrawerFooter>
          {footer && (
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
              {footer}
            </div>
          )}
        </DrawerFooter>

        {/* Close button */}
        <Dialog.Close className="absolute top-4 right-4 p-2 rounded-md hover:bg-gray-100">
          <X className="h-5 w-5" />
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

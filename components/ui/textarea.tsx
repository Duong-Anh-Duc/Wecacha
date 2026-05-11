import * as React from "react";
import {cn} from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({className, ...props}, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-32 w-full rounded-md border border-forest-900/14 bg-white/70 px-3 py-2 text-sm text-forest-950 shadow-sm transition placeholder:text-forest-950/42 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-earth-600 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export {Textarea};

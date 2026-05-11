import * as React from "react";
import {cn} from "@/lib/utils";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-forest-900/14 bg-forest-800/8 px-3 py-1 text-xs font-semibold uppercase text-forest-900",
        className
      )}
      {...props}
    />
  );
}

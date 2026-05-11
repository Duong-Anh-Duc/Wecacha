import {cn} from "@/lib/utils";

type SectionHeadingProps = {
  kicker?: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
  className?: string;
  light?: boolean;
};

export function SectionHeading({
  kicker,
  title,
  copy,
  align = "left",
  className,
  light = false
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {kicker ? (
        <p
          className={cn(
            "mb-4 text-xs font-bold uppercase text-earth-600",
            light && "text-ember"
          )}
        >
          {kicker}
        </p>
      ) : null}
      <h2
        className={cn(
          "font-serif text-4xl leading-[1.04] text-forest-950 sm:text-5xl lg:text-6xl",
          light && "text-parchment-50"
        )}
      >
        {title}
      </h2>
      {copy ? (
        <p
          className={cn(
            "mt-5 max-w-2xl text-base leading-8 text-forest-950/68",
            align === "center" && "mx-auto",
            light && "text-white/70"
          )}
        >
          {copy}
        </p>
      ) : null}
    </div>
  );
}

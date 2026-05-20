import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", align === "center" && "mx-auto max-w-2xl text-center", className)}>
      <Badge>{eyebrow}</Badge>
      <div className="space-y-3">
        <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
        <p className="max-w-2xl text-base leading-8 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

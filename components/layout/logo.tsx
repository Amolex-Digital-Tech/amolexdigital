import Image from "next/image";
import Link from "next/link";

import { LOGO_ASSET_PATH } from "@/lib/site";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  withWordmark?: boolean;
};

export function Logo({ className, withWordmark = true }: LogoProps) {
  const glyph = (
    <span className="relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-[1.35rem] border border-secondary/30 bg-[linear-gradient(145deg,rgba(16,61,46,0.96),rgba(16,61,46,0.98))] shadow-glow">
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_24%,rgba(178,146,103,0.26),transparent_40%)]" />
      <span className="relative -mt-0.5 text-[2rem] font-semibold italic leading-none text-secondary [font-family:Georgia,'Times_New_Roman',serif]">
        A
      </span>
      <span className="absolute bottom-2 right-2 h-3 w-3 rotate-45 border-r-2 border-t-2 border-secondary/90" />
    </span>
  );

  return (
    <Link href="/" className={cn("inline-flex items-center gap-3", className)}>
      {withWordmark ? (
        <Image
          src={LOGO_ASSET_PATH}
          alt="Amolex Digital Tech"
          width={180}
          height={72}
          className="h-12 w-auto object-contain"
          priority
        />
      ) : (
        glyph
      )}
    </Link>
  );
}

import Image from "next/image";
import type { CSSProperties } from "react";

/** Single place to tune: duration for one full clockwise rotation of the ring layer. */
export const COIN_EMBLEM_SPIN_DURATION = "24s";

interface CoinEmblemProps {
  /** Public path to the outer ring image (this layer spins). */
  ringSrc: string;
  /** Public path to the center disc image (this layer stays still). */
  centerSrc: string;
  /** Square side length in px — both layers fill this container. */
  size: number;
  /** CSS duration string for one full ring rotation, e.g. "24s". */
  spinDuration?: string;
  /** Alt text for the center image. Empty string marks it decorative. */
  centerAlt?: string;
  /** Pass true when this emblem is above the fold so Next.js preloads both images. */
  priority?: boolean;
}

export function CoinEmblem({
  ringSrc,
  centerSrc,
  size,
  spinDuration = COIN_EMBLEM_SPIN_DURATION,
  centerAlt = "",
  priority = false,
}: CoinEmblemProps) {
  return (
    <div
      className="relative shrink-0"
      style={
        {
          width: size,
          height: size,
          "--coin-emblem-spin-duration": spinDuration,
        } as CSSProperties
      }
    >
      {/* Ring — rotates via .coin-emblem-ring in globals.css */}
      <Image
        src={ringSrc}
        alt=""
        fill
        sizes={`${size}px`}
        priority={priority}
        className="coin-emblem-ring absolute inset-0 h-full w-full object-contain"
      />
      {/* Center disc — stays still, sits on top */}
      <Image
        src={centerSrc}
        alt={centerAlt}
        fill
        sizes={`${size}px`}
        priority={priority}
        className="absolute inset-0 z-[1] h-full w-full object-contain"
      />
    </div>
  );
}

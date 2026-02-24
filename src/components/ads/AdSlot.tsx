/**
 * Placeholder ad slot for future Google Ads (AdSense).
 * Sizes match standard IAB/Google ad dimensions.
 * Replace this component's content with your ad unit when ready.
 */
interface AdSlotProps {
  /** Unique id for the ad slot (e.g. "home-top", "home-mid-1") */
  slotId?: string;
  /** Visual size variant – dimensions match real ad units */
  size?: "banner" | "rectangle" | "large-rectangle" | "inline" | "box";
  /** Optional label shown above the slot (e.g. "Advertisement") */
  label?: string;
}

// Standard ad dimensions (width × height in px)
const sizeStyles: Record<
  NonNullable<AdSlotProps["size"]>,
  { width: number; height: number }
> = {
  banner: { width: 728, height: 90 }, // Leaderboard
  rectangle: { width: 300, height: 250 }, // Medium rectangle
  "large-rectangle": { width: 336, height: 280 },
  inline: { width: 468, height: 60 }, // Banner
  box: { width: 300, height: 250 }, // Same as rectangle, for 3-in-a-row
};

export function AdSlot({ slotId, size = "rectangle", label }: AdSlotProps) {
  const { width, height } = sizeStyles[size];

  return (
    <aside
      aria-label="Advertisement"
      className="flex flex-col items-center justify-center py-4"
      data-ad-slot={slotId}
    >
      {label && (
        <span className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          {label}
        </span>
      )}
      <div
        className="flex shrink-0 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-700"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          maxWidth: "100%",
        }}
      >
        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Ads
        </span>
      </div>
    </aside>
  );
}

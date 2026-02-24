import { AdSlot } from "./AdSlot";

/**
 * Row of 3 box ads (300×250 each). Three in a row on large screens.
 */
interface AdSlotRowProps {
  /** Base slot id; slots will be {baseId}-1, {baseId}-2, {baseId}-3 */
  baseSlotId?: string;
  label?: string;
}

export function AdSlotRow({ baseSlotId = "home-box", label }: AdSlotRowProps) {
  return (
    <div className="w-full">
      {label && (
        <div className="mb-2 flex justify-center">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            {label}
          </span>
        </div>
      )}
      <div className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AdSlot slotId={`${baseSlotId}-1`} size="box" />
        <AdSlot slotId={`${baseSlotId}-2`} size="box" />
        <AdSlot slotId={`${baseSlotId}-3`} size="box" />
      </div>
    </div>
  );
}

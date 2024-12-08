import * as React from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { debounce } from "@/lib/debounce";
import { cn } from "@/lib/utils";

export type WheelPickerItem = { value: string; label: string };

interface WheelPickerProps {
  items: WheelPickerItem[];
  value: string;
  onChange: (value: string) => void;
  visibleCount?: number;
  className?: string;
  itemHeight?: number;
}

export const WheelPicker: React.FC<WheelPickerProps> = ({
  items,
  value,
  onChange,
  visibleCount = 5,
  itemHeight = 40,
  className,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const halfVisibleCount = Math.floor(visibleCount / 2);
  const offset = halfVisibleCount * itemHeight;

  const initialIndex = items.findIndex((item) => item.value === value);
  const [selectedIndex, setSelectedIndex] = React.useState(initialIndex >= 0 ? initialIndex : 0);

  const [viewportHeight, setViewportHeight] = React.useState(0);

  // Measure viewport after mount
  React.useEffect(() => {
    if (containerRef.current) {
      setViewportHeight(containerRef.current.clientHeight);
      // Center initial selection
      if (initialIndex >= 0) {
        const scrollTop = offset + initialIndex * itemHeight + itemHeight / 2 - containerRef.current.clientHeight / 2;
        containerRef.current.scrollTop = scrollTop;
      }
    }
  }, [initialIndex, itemHeight, offset]);

  // Sync external value changes
  React.useEffect(() => {
    const idx = items.findIndex((item) => item.value === value);
    if (idx >= 0 && idx !== selectedIndex && containerRef.current && viewportHeight > 0) {
      setSelectedIndex(idx);
      const scrollTop = offset + idx * itemHeight + itemHeight / 2 - viewportHeight / 2;
      containerRef.current.scrollTop = scrollTop;
    }
  }, [value, items, selectedIndex, itemHeight, offset, viewportHeight]);

  const handleScroll = React.useCallback(() => {
    if (!containerRef.current || viewportHeight === 0) return;
    const scrollTop = containerRef.current.scrollTop;
    const newIndex = Math.round((scrollTop + viewportHeight / 2 - offset - itemHeight / 2) / itemHeight);

    if (newIndex !== selectedIndex && newIndex >= 0 && newIndex < items.length) {
      setSelectedIndex(newIndex);
      onChange(items[newIndex].value);
    }
  }, [itemHeight, selectedIndex, onChange, items, offset, viewportHeight]);

  const debouncedHandleScroll = React.useMemo(
    () =>
      debounce(() => {
        handleScroll();
      }, 200),
    [handleScroll],
  );

  return (
    <div className={cn("relative w-32", className)}>
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 h-10 -translate-y-1/2 border-y-2 border-green-500"
        style={{ lineHeight: `${itemHeight}px` }}
      ></div>
      <ScrollArea.Root className="w-full h-[200px]" type="auto">
        <ScrollArea.Viewport
          className="w-full h-full overflow-y-auto" // Removed snap classes
          ref={containerRef}
          onScroll={debouncedHandleScroll}
        >
          <div
            className="relative flex flex-col items-center w-full"
            style={{
              paddingTop: offset,
              paddingBottom: offset,
            }}
          >
            {items.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.value}
                  className={cn(
                    "flex items-center justify-center h-10 w-full",
                    isSelected ? "font-bold text-green-600" : "text-gray-700",
                  )}
                >
                  {item.label}
                </div>
              );
            })}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb className="bg-gray-300 rounded" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
};

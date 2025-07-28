import { useEffect, useRef, useState } from "react";

export const useInfiniteScroll = (items: any[], chunkSize = 10) => {
  const [visibleItems, setVisibleItems] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleItems(items.slice(0, chunkSize));
  }, [items]);

  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const nextItems = items.slice(0, visibleItems.length + chunkSize);
          setVisibleItems(nextItems);
          setHasMore(nextItems.length < items.length);
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [visibleItems, hasMore, items]);

  return { visibleItems, loaderRef, hasMore };
};

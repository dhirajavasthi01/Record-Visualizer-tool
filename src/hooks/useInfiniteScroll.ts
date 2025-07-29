import { useState, useEffect, useRef } from "react";

export function useInfiniteScroll<T>(data: T[], step: number = 10) {
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleItems(data.slice(0, step));
    setHasMore(data.length > step);
  }, [data, step]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasMore) {
        setVisibleItems((prev) => {
          const next = data.slice(0, prev.length + step);
          setHasMore(next.length < data.length ? true : false);
          return next;
        });
      }
    });

    const loader = loaderRef.current;
    if (loader) observer.observe(loader);

    return () => {
      if (loader) observer.unobserve(loader);
    };
  }, [loaderRef, data, hasMore, step]);

  return { visibleItems, loaderRef, hasMore };
}

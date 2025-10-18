import { useState, useEffect, RefObject } from 'react';

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export const useIntersectionObserver = (
  ref: RefObject<Element>,
  options: IntersectionObserverOptions = {}
): IntersectionObserverEntry | null => {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([newEntry]) => {
        // We only need to know when it's intersecting, and we only need to know once.
        if (newEntry.isIntersecting) {
          setEntry(newEntry);
          // Stop observing the element once it's visible.
          observer.unobserve(element);
        }
      },
      {
        root: options.root,
        rootMargin: options.rootMargin || '200px', // Start loading images 200px before they enter the viewport
        threshold: options.threshold || 0.01,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
    // We only want to re-run the effect if the element or options change.
  }, [ref, options.root, options.rootMargin, options.threshold]);

  return entry;
};

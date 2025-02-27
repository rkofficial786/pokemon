import { RefObject, useEffect, useRef } from "react";

export function useInfiniteScroll(callback: () => void): RefObject<HTMLDivElement> {
    const triggerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
      const triggerElement = triggerRef.current;
      if (!triggerElement) return;
      
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            callback();
          }
        },
        { threshold: 0.1 }
      );
      
      observer.observe(triggerElement);
      
      return () => {
        if (triggerElement) {
          observer.unobserve(triggerElement);
        }
      };
    }, [callback]);
    
    return triggerRef;
  }
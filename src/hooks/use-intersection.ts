

import { useState, useEffect, useRef, RefObject } from "react";

interface UseIntersectionObserverProps {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

// Make the hook generic to work with any HTML element type
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.1,
  root = null,
  rootMargin = "0%",
  freezeOnceVisible = true,
}: UseIntersectionObserverProps = {}): [boolean, RefObject<T>] {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;

        // Update state when element is visible
        if (isIntersecting || !freezeOnceVisible) {
          setIsVisible(isIntersecting);
        } else if (freezeOnceVisible && isVisible) {
          // If already visible and we want to freeze it, don't change the state
          return;
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, root, rootMargin, freezeOnceVisible, isVisible]);

  return [isVisible, elementRef];
}
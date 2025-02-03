import { useEffect, useState, type RefObject } from "react"

interface UseIntersectionObserverProps {
  target: RefObject<Element>
  onIntersect?: () => void
  threshold?: number
  rootMargin?: string
}

export function useIntersectionObserver({
  target,
  onIntersect,
  threshold = 0.1,
  rootMargin = "0px",
}: UseIntersectionObserverProps) {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        if (entry.isIntersecting && onIntersect) {
          onIntersect()
        }
      },
      {
        rootMargin,
        threshold,
      },
    )

    const element = target.current
    if (!element) return

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [target, onIntersect, threshold, rootMargin])

  return isIntersecting
}


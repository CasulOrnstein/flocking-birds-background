import { useEffect, useState } from 'react'
import { BoundingBox } from '../interfaces'
import { Vector } from '../classes'

// Returns an updated set of window properties whenever the window is resized.
export const useWindowProperties = () => {
  const [width, setWidth] = useState(document.body.clientWidth);
  const [height, setHeight] = useState(document.documentElement.scrollHeight);
  const [elementBounds, setElementBounds] = useState<BoundingBox[]>([]);

  const updateWidthAndHeight = () => {
    setWidth(document.body.clientWidth);
    setHeight(document.documentElement.scrollHeight);
  };

  const getElementBounds = (el: Element) => ({
    top: el['offsetTop'],
    bottom: el['offsetTop'] + el['offsetHeight'],
    right: el['offsetLeft'] + el['offsetWidth'],
    left: el['offsetLeft']
  })

  // Handle resize events
  useEffect(() => {
    // Get all elements with className: avoider and get their bounds
    setElementBounds(
      Array.from(document.querySelectorAll('.avoider'))
      .map(getElementBounds)
    )

    // Handle adding/removing the window resize listener.
    window.addEventListener("resize", updateWidthAndHeight);
    return () => {
      window.removeEventListener("resize", updateWidthAndHeight);
    }
  }, [width, height])

  return { windowSize: new Vector(width, height), elementBounds}
}

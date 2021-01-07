import { useState, useEffect, useRef } from 'react'
import { BoundingBox, DrawFunction } from '../interfaces'
import { Boid, Vector } from '../classes'
import { BOID_SPEED, SPAWN_DEBUG_BIRD } from '../config'
import { useWindowProperties } from './useWindowProperties'
import { drawBoid, drawVisionWidgets, getNextSprite } from '../utils/animation'

export const useAnimateBoids = (initialBoidCount: number) => {
  // Subscribe to updates to window properties
  const { windowSize, elementBounds } = useWindowProperties()

  // Setup refs
  const canvasRef = useRef<null | HTMLCanvasElement>(null)
  const animReqId = useRef(0)

  // Handle initial particles to persist positions on re-renders
  const [initialBoids, setInitialBoids] = useState(createInitialBoids(initialBoidCount, windowSize))

  const drawFunction = draw(windowSize)

  useEffect(() => {
    const boids = initialBoids
    let mousePosition: Vector | undefined
    const canvas = canvasRef.current

    const updateMousePos = (e) => {
      mousePosition = new Vector(
        e.x + document.documentElement.scrollLeft,
        e.y + document.documentElement.scrollTop
      )
    }

    const nullMousePos = () => {
      mousePosition = undefined
    }

    // Setup the canvas
    if (canvas) {
      canvas.width = windowSize.x
      canvas.height = windowSize.y
      canvas.addEventListener('mousemove', updateMousePos)
      canvas.addEventListener('mouseout', nullMousePos)
    }

    // Create the tick function, which updates the boids and draws a new frame.
    const tick = () => {
      drawFunction(canvasRef, boids)
      const boundingBoxes = calculateBoundingBoxes(elementBounds)
      boids.forEach(b => b.update(boids, mousePosition, boundingBoxes))
      animReqId.current = requestAnimationFrame(tick)
    }

    // Initiate ticks
    tick()

    return () => {
      // Set initial boids, so on re-render all boids are in the same place.
      setInitialBoids(boids)
      cancelAnimationFrame(animReqId.current)

      // Remove mouse position listeners
      if (canvas) {
        canvas.removeEventListener('mousemove', updateMousePos)
        canvas.removeEventListener('mouseout', nullMousePos)
      }
    }
  }, [drawFunction, elementBounds, initialBoids, windowSize])

  return canvasRef
}

const draw = (windowSize: Vector): DrawFunction =>
  (canvasRef: React.MutableRefObject<HTMLCanvasElement>, boids: Boid[]) => {
    if (!canvasRef) return
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // clear the previous frame
    ctx.clearRect(0, 0, windowSize.x, windowSize.y);

    boids.forEach(boid => {
      // Calculate the next sprite to draw
      const spriteToDraw = getNextSprite(boid)

      // Draw the boid
      drawBoid(ctx, boid, spriteToDraw)

      // Draw debug widgets
      drawVisionWidgets(ctx, boid)
    })
  }

  const createInitialBoids = (initialBoidCount: number, windowSize: Vector) => {  
    const boids: Boid[] = []
  
    for (let i = 0; i < initialBoidCount; ++i) {
      boids.push(new Boid({
        debug: SPAWN_DEBUG_BIRD ? i===0 : false,
        x: Math.random() * windowSize.x,
        y: Math.random() * windowSize.y,
        speed: BOID_SPEED
      }))
    }
  
    return boids
  }

  const calculateBoundingBoxes = (elementBounds) => {
    const screenTop =  document.documentElement.scrollTop
    const screenBottom = screenTop + window.innerHeight
    const screenLeft = document.documentElement.scrollLeft
    const screenRight = screenLeft + window.innerWidth

    // Screen bounds are made by adding large bounding boxes surrounding the visible window
    const offscreenBoxes: BoundingBox[] = [
      { top: screenTop-5000, bottom: screenTop, left: screenLeft-5000, right: screenRight + 5000}, // Top bound
      { top: screenTop-5000, bottom: screenBottom + 5000, left: screenRight, right: screenRight + 5000}, // Right bound
      { top: screenBottom, bottom: screenBottom + 5000, left: screenLeft-5000, right: screenRight + 5000}, // Bottom bound
      { top: screenTop-5000, bottom: screenBottom + 5000, left: screenLeft-5000, right: screenLeft}, // Left bound
    ]

    return [...elementBounds, ...offscreenBoxes]
  }

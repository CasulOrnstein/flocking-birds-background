import * as React from 'react'
import { useAnimateBoids} from './hooks/useAnimateBoids'
import { INITIAL_BOID_COUNT } from './config'

export type IBackgroundProps = {
  initialBirdCount?: number
}

export const FlockingBirdsBackground: React.FC<IBackgroundProps> = ({ initialBirdCount = INITIAL_BOID_COUNT }) => {
  // Animate the canvas
  const canvasRef = useAnimateBoids(initialBirdCount)

  // Dispatch a resize event after 10ms to ensure the true scroll height is read once
  // all page elements have loaded.
  setTimeout(() => {window.dispatchEvent(new Event('resize'));}, 10)

  return (
    <div style={{ position: 'absolute', overflow: 'hidden'}}>
      <canvas
        ref={canvasRef}
        style={{display: "block"}}
      />
    </div>
  )
}

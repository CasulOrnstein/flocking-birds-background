import { Boid } from "../classes";
import { VISION_RANGE, BOX_VISION_RANGE, TURN_ANIMATION_THRESHOLD_ANGLE, ENABLE_VISION_DEBUG, ANIMATION_FRAME_HOLD, MIN_TURN_FRAMES_FOR_ANIMATION_CHANGE } from '../config'
import { straightSprites, turningSprites } from '../animationSprites'

export const drawVisionWidgets = (ctx: CanvasRenderingContext2D, boid: Boid) => {
  if (boid.debug && ENABLE_VISION_DEBUG) {
    // Draw box vision radius
    ctx.fillStyle = '#ff000011'
    ctx.beginPath();
    ctx.arc(boid.position.x, boid.position.y, BOX_VISION_RANGE, 0, 2 * Math.PI);
    ctx.fill()

    // Draw boid vision radius
    ctx.fillStyle = '#ff000022'
    ctx.beginPath();
    ctx.arc(boid.position.x, boid.position.y, VISION_RANGE, 0, 2 * Math.PI);
    ctx.fill()
  }
}

export const drawBoid = (ctx: CanvasRenderingContext2D, boid: Boid, spriteToDraw: Path2D) => {
  // Draw debug boids as green
  ctx.fillStyle = boid.debug ? `#00ff00`  : `#1C3E5C`
  ctx.translate(boid.position.x, boid.position.y);
  ctx.scale(0.2, 0.2)
  ctx.rotate(-1 * boid.velocity.getAngleFromPosX() + (Math.PI / 2))
  ctx.fill(spriteToDraw)

  // Reset transform
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

export const getNextSprite = (boid: Boid) => {
  // Advance the boids animation frame hold
  boid.animationFrameHold = (boid.animationFrameHold + 1) % ANIMATION_FRAME_HOLD
  
  // If the boid is turning, increment the turn count, else reset it
  if (boid.turnAngle >= TURN_ANIMATION_THRESHOLD_ANGLE) {
    boid.turnCount++
  } else {
    boid.turnCount = 0
  }

  // Check if the boid meets the criteria to enter a turning state
  const isTurning = boid.turnCount > MIN_TURN_FRAMES_FOR_ANIMATION_CHANGE

  // If the frame hold has reset to 0, update the frame and the turning flag
  if(boid.animationFrameHold === 0) {
    if (boid.animationIsTurning !== isTurning) {
      // If switched turning state, choose a random frame to start from.
      boid.animationFrame = isTurning ? Math.floor(Math.random() * turningSprites.length) : Math.floor(Math.random() * straightSprites.length)
    } else {
      // Else increment from the last frame
      boid.animationFrame = isTurning ? (boid.animationFrame + 1) % turningSprites.length : (boid.animationFrame + 1) % straightSprites.length 
    }

    // Update the turning flag
    boid.animationIsTurning = isTurning
  }

  return boid.animationIsTurning ? turningSprites[boid.animationFrame] : straightSprites[boid.animationFrame]
}

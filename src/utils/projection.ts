import { BoundingBox, Zone } from "../interfaces"
import { Vector, BoidVision } from "../classes"
import { BOX_VISION_RANGE, SHADOW_SIZE } from '../config'

// Add the occluded region caused from a bounding box to a boids vision list
export const addOcclusionFromBoundingbox = (position: Vector, box: BoundingBox, vision: BoidVision) => {
  const zone = getZone(position, box)

  // If the boid cannot see the box, there is no occlusion
  if (getDistanceToBox(box, position, zone) > BOX_VISION_RANGE) return undefined

  // If a boid is inside a box, no occlusion is added
  if (zone === Zone.Centre) return undefined

  const shadowCorners = getShadowCorners(box, zone)
  let angles: number[] = []
  for(const shadowCorner of shadowCorners) {
    const directionToBoid = shadowCorner.difference(position)
    angles.push(directionToBoid.getAngleFromPosX())
  }
  vision.addOccludedRegion(angles[0], angles[1])
}

// Add the occluded region caused from another boid to a boids vision list
export const addOcclusionFromBoid = (position: Vector, boidPosition: Vector, boidDistance: number, vision: BoidVision) => {
  const angleCovered = 2 * Math.atan2(1, 2 * boidDistance) * SHADOW_SIZE
  const directionToBoid = boidPosition.difference(position)
  const angleToBoid = directionToBoid.getAngleFromPosX()

  vision.addOccludedRegion(angleToBoid - angleCovered*0.5, angleToBoid + angleCovered*0.5)
}

// Returns the zone relative to a bounding box, which a boid is in, i.e top-left, centre, bottom etc.
export const getZone = (boidPos: Vector, boundingBox: BoundingBox): Zone => {
  // Return the zone depending on columns (once row has been decided)
  const getXZone = (leftZone, midZone, rightZone) => {
    if (boidPos.x < boundingBox.left) {
      return leftZone
    } else if (boidPos.x < boundingBox.right) {
      return midZone
    } else {
      return rightZone
    }
  }
  
  // Return the zone depending on each row
  if (boidPos.y < boundingBox.top) {
    return getXZone(Zone.TopLeft, Zone.Top, Zone.TopRight)
  } else if (boidPos.y < boundingBox.bottom) {
    return getXZone(Zone.Left, Zone.Centre, Zone.Right)
  } else {
    return getXZone(Zone.BottomLeft, Zone.Bottom, Zone.BottomRight)
  }
}

export const getShadowCorners = (box: BoundingBox, currentZone: Zone): Vector[] => {
  switch (currentZone) {
    case Zone.TopLeft:
      return [new Vector(box.left, box.bottom), new Vector(box.right, box.top)]
    case Zone.Top:
      return [new Vector(box.left, box.top), new Vector(box.right, box.top)]
    case Zone.TopRight:
      return [new Vector(box.left, box.top), new Vector(box.right, box.bottom)]
    case Zone.Left:
      return [new Vector(box.left, box.bottom), new Vector(box.left, box.top)]
    case Zone.Centre:
      return []
    case Zone.Right:
      return [new Vector(box.right, box.top), new Vector(box.right, box.bottom)]
    case Zone.BottomLeft:
      return [new Vector(box.right, box.bottom), new Vector(box.left, box.top)]
    case Zone.Bottom:
      return [new Vector(box.right, box.bottom), new Vector(box.left, box.bottom)]
    case Zone.BottomRight:
      return [new Vector(box.right, box.top), new Vector(box.left, box.bottom)]
  }
}

export const getDistanceToBox = (box: BoundingBox, boidPos: Vector, currentZone: Zone): number => {
  switch (currentZone) {
    case Zone.TopLeft:
      return boidPos.difference(new Vector(box.left, box.top)).length()
    case Zone.Top:
      return box.top - boidPos.y
    case Zone.TopRight:
      return boidPos.difference(new Vector(box.right, box.top)).length()
    case Zone.Left:
      return box.left - boidPos.x
    case Zone.Centre:
      return 0
    case Zone.Right:
      return boidPos.x - box.right
    case Zone.BottomLeft:
      return boidPos.difference(new Vector(box.left, box.bottom)).length()
    case Zone.Bottom:
      return boidPos.y - box.bottom
    case Zone.BottomRight:
      return boidPos.difference(new Vector(box.right, box.bottom)).length()
  }
}

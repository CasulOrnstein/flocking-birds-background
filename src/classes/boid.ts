import { Vector, BoidVision } from "../classes"
import { BoundingBox, Zone } from "../interfaces"
import {
  ALIGNMENT_WITH_OTHERS_COUNT,
  PROJECTION_SECTOR_COUNT,
  COLLISION_LOOKAHEAD,
  VISION_RANGE,
  BOUNDARY_PADDING,
  MOUSE_VISION_RANGE,
  MAX_TURN_ANGLE
} from '../config'

import { addOcclusionFromBoundingbox, addOcclusionFromBoid, getZone } from '../utils/projection'

type distanceList = { boid: Boid, distance: number}[]

export class Boid {
  debug: boolean;
  position: Vector
  velocity: Vector
  speed: number
  turnAngle: number
  turnCount: number
  animationFrame: number
  animationFrameHold: number
  animationIsTurning: boolean

  constructor({ debug, x, y, speed }) {
    this.debug = debug
    this.position = new Vector(x,y)
    this.speed = speed
    this.velocity = Vector.random()
    this.turnAngle = 0
    this.turnCount = 0
    this.animationFrame = 0
    this.animationFrameHold = 0
    this.animationIsTurning = false
  }

  update(boids: Boid[], mousePos?:Vector, elementBounds?: BoundingBox[]) {
    const distanceList = this.getAllDistances(boids)

    // Get all directional influences 
    const alignment = this.getAlignment(distanceList)
    const projection = this.getProjection(distanceList, elementBounds)
    const attraction = this.getAttraction(mousePos)
    const collision = this.getCollision(elementBounds)
    const noise = Vector.random()

    // Take a weighted sum of all the influences and normalize.
    let direction = Vector.sum(
      alignment.multiply(0.75),
      projection.multiply(0.2),
      attraction.multiply(0.1),
      noise.multiply(0.05),
      collision.multiply(0.5)
    ).normalize()

    // Ensure boid is not turning more than the maximum turn angle
    const angleBetween = Vector.angleBetween(this.velocity, direction)
    if (angleBetween > MAX_TURN_ANGLE && angleBetween < (Math.PI * 2) - MAX_TURN_ANGLE) {
      this.turnAngle = MAX_TURN_ANGLE
      direction = this.velocity.normalize().rotateByAngle(MAX_TURN_ANGLE * Math.sign(angleBetween - Math.PI))
    } else {
      this.turnAngle = Math.min((Math.PI * 2) - angleBetween, angleBetween)
    }

    // Update the boid
    this.velocity = direction.multiply(this.speed)
    this.position = this.position.add(this.velocity)

    return this
  }

  getAllDistances(boids: Boid[]) {    
    return boids
      .map(b => ({
        boid: b,
        distance: this.position.distanceTo(b.position)
      }))
      .filter(b => b.distance !== 0 && b.distance < VISION_RANGE)
      .sort((a,b) => a.distance - b.distance)
  }

  getAttraction(mousePos?: Vector) {
    if (mousePos) {

      const distanceToMouse = mousePos.distanceTo(this.position)
      if (distanceToMouse < MOUSE_VISION_RANGE && distanceToMouse > 100) {
        return mousePos.difference(this.position).normalize()
      }
    }

    return new Vector(0,0)
  }

  getAlignment(distanceList: distanceList) {
    return distanceList
      .slice(0,ALIGNMENT_WITH_OTHERS_COUNT) // Consider only closest X neighbours
      .reduce((acc, cur) => acc.add(cur.boid.velocity), new Vector(0,0)) // Sum velocity
      .normalize()
  }

  getProjection(distanceList: distanceList, elementBounds: BoundingBox[] = []) {
    const vision = new BoidVision()

    // Add occulsion contributed by web elements
    for(const box of elementBounds) {
      addOcclusionFromBoundingbox(this.position, box, vision)
    }

    // Add occlusion contributed by other boids
    for(const boidDist of distanceList) {
      addOcclusionFromBoid(this.position, boidDist.boid.position, boidDist.distance, vision)
    }

    // Calculate indices of boundaries (transitions from light to dark)
    let boundaries: number[] = []
    for (let i=0; i < PROJECTION_SECTOR_COUNT; i++) {
      // Ensure we wrap around at the first index
      const previousIndex = i===0 ? PROJECTION_SECTOR_COUNT-1 : i-1

      if (vision.occludedSectors[i] !== vision.occludedSectors[previousIndex]) {
        boundaries.push(i)
      }
    }
    
    // Calculate projection influence by summing direction to all boundaries
    const summedVector = boundaries.reduce((sum, boundaryIndex) => {
      const angle = BoidVision.getAngleFromIndex(boundaryIndex)
      const vectorToBoundary = Vector.fromAngle(angle)
      return sum.add(vectorToBoundary)
    }, new Vector(0,0))

    return summedVector.normalize()
  }

  getCollision(boxes: BoundingBox[] = []) {
    // Init repulsion vector
    let totalRepulsion = new Vector(0,0)

    // This is the position of the boid if it continued travelling at this velocity
    // in COLLISION_LOOKAHEAD timesteps
    const lookAheadPoint = this.position.add(this.velocity.multiply(COLLISION_LOOKAHEAD))
    
    // Function for scaling the repulsion force
    const repulsionForce = (dist: number) => Math.abs(dist / BOUNDARY_PADDING)

    boxes.forEach(box=>{
      const zone = getZone(this.position, box)
      const boxCentre = new Vector((box.right + box.left) / 2, (box.top + box.bottom) / 2)
      const directionFromCentre = this.position.difference(boxCentre)
      
      // X & Y positions when coords are mapped to a square
      const xNorm = directionFromCentre.x / (box.right - box.left)
      const yNorm = directionFromCentre.y / (box.bottom - box.top)

      const halfBoxHeight = (box.bottom - box.top) / 2
      const halfBoxWidth = (box.right - box.left) / 2

      const isWithinYBoundary = Math.abs(directionFromCentre.y) - halfBoxHeight < BOUNDARY_PADDING 
      const isWithinXBoundary = Math.abs(directionFromCentre.x) - halfBoxWidth < BOUNDARY_PADDING

      // Add repulsion if inside box
      if (zone === Zone.Centre) {
        if (Math.abs(xNorm) >= Math.abs(yNorm)) {
          totalRepulsion.x += Math.sign(xNorm)
        } else {
          totalRepulsion.y += Math.sign(yNorm)
        }
      }
      
      // Add repulsion if within proximity of box (vertically)
      if (isWithinYBoundary) {
        const distanceFromBoundaryX = (halfBoxWidth + BOUNDARY_PADDING) - Math.abs(directionFromCentre.x)
        if (distanceFromBoundaryX > 0 && distanceFromBoundaryX < BOUNDARY_PADDING) {
          totalRepulsion.x += Math.sign(directionFromCentre.x) * repulsionForce(distanceFromBoundaryX)
        }
      }

      // Add repulsion if within proximity of box (horizontally)
      if (isWithinXBoundary) {
        const distanceFromBoundaryY = (halfBoxHeight + BOUNDARY_PADDING) - Math.abs(directionFromCentre.y)
        if (distanceFromBoundaryY > 0 && distanceFromBoundaryY < BOUNDARY_PADDING) {
          totalRepulsion.y += Math.sign(directionFromCentre.y) * repulsionForce(distanceFromBoundaryY)
        }
      }

      // Add repulsion if look ahead is within the box
      if (getZone(lookAheadPoint, box) === Zone.Centre) {
        const lookAheadDirectionFromCentre = lookAheadPoint.difference(boxCentre) 
        
        // Force is scaled by how deep the look ahead is into the box
        const lookAheadInsideX = halfBoxWidth - Math.abs(lookAheadDirectionFromCentre.x)
        const lookAheadInsideY = halfBoxHeight - Math.abs(lookAheadDirectionFromCentre.y)

        if (Math.abs(xNorm) >= Math.abs(yNorm)) {
          totalRepulsion.x += (Math.sign(xNorm) * lookAheadInsideX) / (COLLISION_LOOKAHEAD * this.speed)
        } else {
          totalRepulsion.y += (Math.sign(yNorm) * lookAheadInsideY) / (COLLISION_LOOKAHEAD * this.speed)
        }
      }
    })  

    return totalRepulsion
  }
}

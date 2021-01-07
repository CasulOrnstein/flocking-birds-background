import { PROJECTION_SECTOR_COUNT } from '../config'

const twoPi = 2 * Math.PI

export class BoidVision {
  occludedSectors: boolean[];

  constructor() {
    this.occludedSectors = new Array(PROJECTION_SECTOR_COUNT).fill(false)
  }

  addOccludedRegion(initialAngle: number, finalAngle: number) {
    // A function to map an angle in radians to the range [0, PROJECTION_SECTOR_COUNT]
    const mapAngleToSectorRange = (angle: number) => {
      angle = (angle  + twoPi) % twoPi
      return (angle * PROJECTION_SECTOR_COUNT) / twoPi
    }

    const initialSectorIndex = Math.floor(mapAngleToSectorRange(initialAngle))
    const finalSectorIndex = Math.ceil(mapAngleToSectorRange(finalAngle))

    const setOccludedBetweenIndices = (startIndex, endIndex) => {
      for (let i = startIndex; i < endIndex; i++) {
        this.occludedSectors[i] = true
      }
    }
    
    if (initialSectorIndex > finalSectorIndex) {
      // Handle case where shadow overlaps the 0 (2PI) radians
      setOccludedBetweenIndices(initialSectorIndex, PROJECTION_SECTOR_COUNT)
      setOccludedBetweenIndices(0, finalSectorIndex)
    } else {
      setOccludedBetweenIndices(initialSectorIndex, finalSectorIndex)
    }
  }

  static getAngleFromIndex(sectorIndex: number) {
    return (sectorIndex * 2 * Math.PI) / PROJECTION_SECTOR_COUNT
  }
}

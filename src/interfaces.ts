import { Boid } from './classes'

export interface BoundingBox {
  top: number,
  bottom: number,
  right: number,
  left: number
}

export enum Zone {
  TopLeft,
  Top,
  TopRight,
  Left,
  Centre,
  Right,
  BottomLeft,
  Bottom,
  BottomRight
}

export type DrawFunction = (canvasRef: React.MutableRefObject<any>, particles: Boid[]) => void
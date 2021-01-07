export class Vector {
  x: number;
  y: number;
 
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  add(other: Vector) {
    return new Vector(other.x + this.x, other.y + this.y)
  }

  difference(other: Vector) {
    return new Vector(this.x - other.x, this.y - other.y)
  }

  multiply(multiple: number) {
    return new Vector(this.x * multiple, this.y * multiple)
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const length = this.length()
    if (length === 0) {
      return new Vector(0,0)
    }
    return new Vector(this.x / length, this.y / length)
  }

  distanceTo(other: Vector) {
    return this.difference(other).length()
  }

  getAngleFromPosX() {
    return Vector.angleBetween(new Vector(1,0), this)
  }

  rotateByAngle(angle: number) {
    return new Vector(
      Math.cos(angle) * this.x - Math.sin(angle) * this.y,
      Math.sin(angle) * this.x + Math.cos(angle) * this.y
    )
  }

  // Sets vector to have random direction and magnitude of 1.
  static random() {
    const angle = Math.random() * 2 * Math.PI
    return new Vector(Math.cos(angle), Math.sin(angle))
  }

  // Returns angle [0,PI] between the two vectors 
  static angleBetween(a: Vector, b: Vector) {
    const angle = Math.atan2(-b.y, b.x) - Math.atan2(-a.y, a.x)

    return angle < 0 ? angle + (Math.PI * 2) : angle
  }

  static sum(...args: (Vector | undefined)[]) {
    return new Vector(
      args.reduce((acc,cur) => acc + (cur?.x || 0), 0),
      args.reduce((acc,cur) => acc + (cur?.y || 0), 0)
    ) 
  }

  static fromAngle(angle: number) {
    return new Vector(Math.cos(angle), -Math.sin(angle))
  }
}

export class Vector {

  constructor(public x: number, public y: number) {
  }

  static randomVec() {
    const a = Math.random() * 2 * Math.PI;
    const offsetX = Math.cos(a);
    const offsetY = Math.sin(a);
    return new Vector(offsetX, offsetY).unit();
  }

  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  unit(): Vector {
    return this.scalar(1 / this.mag());
  }

  scalar(scal: number): Vector {
    return new Vector(this.x * scal, this.y * scal);
  }

  setMag(mag: number): Vector {
    return this.unit().scalar(mag);
  }

  add(vec: Vector): Vector {
    return new Vector(this.x + vec.x, this.y + vec.y);
  }

  fastDist(vec: Vector) {
    return Math.abs(Math.pow(this.x - vec.x, 2) + Math.pow(this.y - vec.y, 2));
  }

  dist(vec: Vector) {
    return Math.sqrt(this.fastDist(vec));
  }
}

export const NullVec = new Vector(-1, -1);


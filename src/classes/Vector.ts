/**
     * Represents a vector with row and column coordinates.
     */
export class Vector {
  r: number;
  c: number;

  /**
   * Creates a new Vector instance.
   * @param r The row coordinate. Default is 0.
   * @param c The column coordinate. Default is 0.
   */
  constructor(r = 0, c = 0) {
    this.r = r;
    this.c = c;
  }

  /**
   * Adds the given vector to this vector and returns a new Vector instance.
   * @param v The vector to add.
   * @returns A new Vector instance representing the sum of the two vectors.
   */
  add(v: Vector) {
    return new Vector(this.r + v.r, this.c + v.c);
  }

  /**
   * Checks if this vector is equal to the given vector.
   * @param v The vector to compare.
   * @returns True if the vectors are equal, false otherwise.
   */
  equals(v: Vector) {
    return this.r === v.r && this.c === v.c;
  }
}

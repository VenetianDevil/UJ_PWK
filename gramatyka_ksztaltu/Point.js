class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  distanceTo(point){
    return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y-point.y, 2));
  }

  get positionVector(){
    return [this.x, this.y, 1];
  }

  transform(m){
    let newPositionVector = m.multiplyByVector(this.positionVector);
    return new Point(newPositionVector[0], newPositionVector[1]);
  }
}

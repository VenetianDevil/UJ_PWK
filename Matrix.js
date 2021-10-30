class Matrix {
  constructor(array){
    this.matrix = Array.from(Array(3), () => new Array(3));
    this.matrix = array;
  }

  multiplyByMatrix(m2){
    let newMatrix = Array.from(Array(3), () => new Array(3));
    for(let i = 0; i< this.matrix.length; i++){
      newMatrix[i] = [0, 0, 0];
      for(let j = 0; j<m2.matrix.length; j++){
        for (let r = 0; r< m2.matrix.length; r++){
          newMatrix[i][j] += this.matrix[i][r] * m2.matrix[r][j];
        }
      }
    }
    return new Matrix(newMatrix);
  }

  multiplyByVector(v){
    let newVector = new Array(v.length);
    for(let i in this.matrix){
      newVector[i] = 0;
      newVector[i] = (this.matrix[i][0] * v[0]) + (this.matrix[i][1] * v[1]) + (this.matrix[i][2] * v[2]);
    }

    return newVector;
  }
}
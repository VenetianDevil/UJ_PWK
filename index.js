var ctx = d3.select('svg');
// var d3Triangle = d3.symbol().type(d3.symbolTriangle);
var triangles = [];

// define d3 symbol for any triangle
function customTriangle(triangleObj){
  return ct = {
    draw: function(ctx){
      ctx.moveTo(triangleObj.A.x, triangleObj.A.y);
      ctx.lineTo(triangleObj.B.x, triangleObj.B.y);
      ctx.lineTo(triangleObj.C.x, triangleObj.C.y);
      ctx.closePath();
    }
  };
};

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  distanceTo(point){
    return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y-point.y, 2));
  }

  get vector(){
    return [this.x, this.y, 1];
  }

  transform(m){
    let newPointVector = m.multiplyByVector(this.vector);
    return new Point(newPointVector[0], newPointVector[1]);
  }
}

class Triangle {
  constructor(A, B, C) {
    this.A = A;
    this.B = B;
    this.C = C;
    this.color = "green";
  }

  getSidesLengths(){
    return [this.A.distanceTo(this.B), this.B.distanceTo(this.C), this.C.distanceTo(this.A)];
  }

  // returns scalar if true or boolean false if not
  isSimilarTo(triangle){
    let t1_sides = this.getSidesLengths();
    let t2_sides = triangle.getSidesLengths();
    let comparer = [[], [], []]; 

    for (let i=0; i < t1_sides.length; i++){
      comparer[0].push(t2_sides[i]/t1_sides[i]);
      comparer[1].push(t2_sides[i+1 >= t1_sides.length ? i+1-t1_sides.length : i+1]/t1_sides[i]);
      comparer[2].push(t2_sides[i+2 >= t1_sides.length ? i+2-t1_sides.length : i+2]/t1_sides[i]);
    }

    // console.log(comparer)

    let areProportionsTheSame = false;
    let scalar = 1;

    for(let proportions of comparer){
      // console.log(proportions)
      areProportionsTheSame = proportions.every((el, i, arr) => {return el == arr[0]});
      // console.log(areProportionsTheSame);
      if (areProportionsTheSame){
        scalar = proportions[0];
        break;
      }
    }

    return areProportionsTheSame ? scalar : false;
  }

  draw(){
    let t = this;
    var ct = d3.symbol().type(customTriangle(t));

    ctx.append('path')
      .attr("d", ct)
      .attr("fill", t.color)
      .attr('stroke-width', "2px")
      .attr("transform", "translate(50, 50)");
      
      triangles.push(t);
  }

  transform(m){
    return new Triangle(this.A.transform(m), this.B.transform(m), this.C.transform(m));
  }
}

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
  
let t1 = new Triangle(new Point(10, 50), new Point(10, 20), new Point(50, 20));
let t2 = new Triangle(new Point(70, 80), new Point(70, 95), new Point(90, 95));
t2.color = 'red';
t1.draw();
t2.draw();

console.log(t1.isSimilarTo(t2));
let scalar = t1.isSimilarTo(t2)

// reflexion OX
let M_reflection = new Matrix([[1, 0, 0], [0, -1, 0], [0, 0, 1]]);
// 
let M_scale = new Matrix([[scalar, 0, 0], [0, scalar, 0], [0, 0, 1]]);
// rotation by (0, 0)
let M_rotation = new Matrix([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
// 
let M_translation = new Matrix([[1, 0, 130], [0, 1, -210], [0, 0, 1]]);

let M_transformation = M_reflection.multiplyByMatrix(M_scale).multiplyByMatrix(M_rotation).multiplyByMatrix(M_translation);

let t3 = t1.transform(M_transformation);
t3.draw()

console.log(M_transformation)

console.log(triangles)

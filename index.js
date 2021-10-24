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
}

class Triangle {
  constructor(A, B, C) {
    this.A = A;
    this.B = B;
    this.C = C;
  }

  getSidesLengths(){
    return [this.A.distanceTo(this.B), this.B.distanceTo(this.C), this.C.distanceTo(this.A)];
  }

  isSimilarTo(triangle){
    let t1_sides = this.getSidesLengths();
    let t2_sides = triangle.getSidesLengths();
    console.log(t1_sides, t2_sides)

    let comparer = [[], [], []]; 

    for (let i=0; i < t1_sides.length; i++){
      comparer[0].push(t1_sides[i]/t2_sides[i]);
      comparer[1].push(t1_sides[i]/t2_sides[i+1 >= t1_sides.length ? i+1-t1_sides.length : i+1]);
      comparer[2].push(t1_sides[i]/t2_sides[i+2 >= t1_sides.length ? i+2-t1_sides.length : i+2]);
    }

    console.log(comparer)

    let areProportionsTheSame = false;

    for(let proportions of comparer){
      console.log(proportions)
      areProportionsTheSame = proportions.every((el, i, arr) => {return el == arr[0]});
      console.log(areProportionsTheSame);
      if (areProportionsTheSame){
        break;
      }
    }

    return areProportionsTheSame
  }

}

function drawTriangle(t){
  var ct = d3.symbol().type(customTriangle(t));
  console.log(d3)

  ctx.append('path')
    .attr("d", ct)
    .attr("fill", "green")
    .attr('stroke-width', "2px")
    .attr("transform", "translate(50, 50)");
    
    triangles.push(t);

  };

  
let t1 = new Triangle(new Point(10, 50), new Point(10, 20), new Point(50, 20));
let t2 = new Triangle(new Point(70, 80), new Point(70, 95), new Point(90, 95));
drawTriangle(t1);
drawTriangle(t2);
t1.isSimilarTo(t2)

console.log(triangles)

// define d3 symbol
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

var triangles = [];

var ctx = d3.select('svg');
// var d3Triangle = d3.symbol().type(d3.symbolTriangle);

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Triangle {
  constructor(A, B, C) {
    this.A = A;
    this.B = B;
    this.C = C;
  }
}

let t1 = new Triangle(new Point(10, 50), new Point(10, 20), new Point(50, 20));

function drawTriangle(t){
  var ct = d3.symbol().type(customTriangle(t));

  ctx.append('path')
    .attr("d", ct)
    .attr("fill", "green")
    .attr('stroke-width', "2px")
    .attr("transform", "translate(50, 50)");

  triangles.push(t);

};


drawTriangle(t1);

console.log(triangles)

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

var ctx = d3.select('svg');
var triangles = [];

class Triangle {
  constructor(A, B, C) {
    this.A = A;
    this.B = B;
    this.C = C;
    this.color = "green";
  }

  getTriangleVectors(){
    let vectors = {
      AB: [this.B.x - this.A.x, this.B.y - this.A.y],
      BC: [this.C.x - this.B.x, this.C.y - this.B.y], 
      CA: [this.A.x - this.C.x, this.A.y - this.C.y]
    }
    return vectors;
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
      comparer[0].push((t2_sides[i]/t1_sides[i]).toFixed(2)); // 0
      comparer[1].push((t2_sides[i+1 >= t1_sides.length ? i+1-t1_sides.length : i+1]/t1_sides[i]).toFixed(2)); //swith  C=A, A=B, B=C // 1
      comparer[2].push((t2_sides[i+2 >= t1_sides.length ? i+2-t1_sides.length : i+2]/t1_sides[i]).toFixed(2)); //switch A=C, B=A, C=B // 2
    }

    let switchAB = [comparer[0][0], comparer[1][1], comparer[2][2]];
    let switchBC = [comparer[0][1], comparer[1][2], comparer[2][0]];
    let switchAC = [comparer[0][2], comparer[1][0], comparer[2][1]];
    comparer.push(switchAB); //3 AB
    comparer.push(switchBC); //4 BC
    comparer.push(switchAC); //5 AC
    
    console.log('comparer', comparer)
    
    let areProportionsTheSame = false;
    let scalar = 1;
    
    let switchBasedOn = 0;
    for(let proportions of comparer){
      // console.log(proportions)
      areProportionsTheSame = proportions.every((el, i, arr) => {return el == arr[0]});
      // console.log(areProportionsTheSame);
      if (areProportionsTheSame){
        scalar = parseFloat(proportions[0]);
        break;
      }
      switchBasedOn++;
    }
    
    console.log(switchBasedOn)
    if(areProportionsTheSame && switchBasedOn != 3){
      switch (switchBasedOn) {
        case 1: //swith  C=A, A=B, B=C
          var temp_A = triangle.A;
          triangle.A = triangle.B
          triangle.B = triangle.C
          triangle.C = temp_A;
          break;  
        case 2: //switch A=C, B=A, C=B
          var temp_A = triangle.A;
          triangle.A = triangle.C
          triangle.C = triangle.B
          triangle.B = temp_A;
          break;
        case 3: //swith AB
          var temp_A = triangle.A;
          triangle.A = triangle.B;
          triangle.B = temp_A;
          break;
        case 4: //swith  BC
          var temp_B = triangle.B;
          triangle.B = triangle.C;
          triangle.C = temp_B;
          break;
        case 5: //swith  AC
          var temp_A = triangle.A;
          triangle.A = triangle.C;
          triangle.C = temp_A;
          break;
      }
    }

    return areProportionsTheSame ? scalar : false;
  }

  getReflectionMatrix(t){
    let this_vectors = this.getTriangleVectors()
    let t_vectors = t.getTriangleVectors();

    var doReflect = false;

    for(var key in this_vectors){
      let xSign = this_vectors[key][0]*t_vectors[key][0];
      let ySign = this_vectors[key][1]*t_vectors[key][1];
      if (xSign == 0 || ySign == 0 || (xSign < 0 && ySign < 0)){ }
      else if(xSign < 0 || ySign < 0){
        doReflect = true; // albo zliczać? i bez break wtedy, strawdzać ile takich jest boków, przy nieparzystej ilości odbijać
        break;
      }
    }

    return new Matrix([[doReflect ? -1 : 1, 0, 0], [0, 1, 0], [0, 0, 1]]);
  }

  getScaleMatrix(scalar){
    return new Matrix([[scalar, 0, 0], [0, scalar, 0], [0, 0, 1]]);
  }

  getRotationMatrix(t, reflectionFactor){
    // console.log('factor: ',reflectionFactor)
    let this_vector_AB = this.getTriangleVectors().AB;
    this_vector_AB[0] = this_vector_AB[0] * reflectionFactor;
    let this_length_AB = this.getSidesLengths()[0];
    let t_vector_AB = t.getTriangleVectors().AB;
    let t_length_AB = t.getSidesLengths()[0];

    // console.log(this_vector_AB, this_length_AB, t_vector_AB, t_length_AB)

    let cosa = (this_vector_AB[0]*t_vector_AB[0] + this_vector_AB[1]*t_vector_AB[1]) / (this_length_AB * t_length_AB);
    let sina = Math.sqrt(1 - Math.pow(cosa, 2));

    let M_rotation =  new Matrix([[cosa, sina, 0], [-sina, cosa, 0], [0, 0, 1]]);
    // console.log(M_rotation)
    return M_rotation;
  }

  getTranslationMatrix(new_t, t, scalar){ //new_t - trójkąt po przekszałceniu przez pierwsze 3 macierze, t - docelowy
    // console.log(new_t, t, scalar)
    // console.log(t.A.x - new_t.A.x)
    // console.log(t.A.y - new_t.A.y)
    var translate_x = (t.A.x - new_t.A.x);
    var translate_y = (t.A.y - new_t.A.y);
    var M_translation = new Matrix([[1, 0, translate_x], [0, 1, translate_y], [0, 0, 1]]);
    return M_translation;
  }

  async getTransformationMatrix(t) {
    let scalar = this.isSimilarTo(t);
    const promise = new Promise((resolve) => {
      if (!scalar) {
        throw "Transformation Matrix doesn't exist; Triangles are not similar";
      }
      var M_reflection = this.getReflectionMatrix(t);
      console.log('odbicie', M_reflection)
      resolve(M_reflection)
    }).then((M_reflection) => {
      var M_scale = this.getScaleMatrix(scalar);
      console.log('scala', M_scale)
      var M_rotation = this.getRotationMatrix(t, M_reflection.matrix[0][0]);
      console.log('obrot', M_rotation)
      return (M_reflection.multiplyByMatrix(M_scale).multiplyByMatrix(M_rotation))
    }).then((M_3) => {
      // console.log('140', M_3)
      let temp_t = this.transform(M_3);
      // temp_t.color = 'orange';
      // temp_t.draw();
      var M_translation = this.getTranslationMatrix(temp_t, t, 1 / scalar);
      console.log('przesuniecie', M_translation)

      // var M_translation = new Matrix([[1, 0, 130], [0, 1, -210], [0, 0, 1]]);
      let M_transformation = M_translation.multiplyByMatrix(M_3); // Dlaczego to działa jak zamieniłam macierze kolejnosciami????????? powinny być na odwrót ale wtedy działa tylko w 1 przypadku, po zamianie działa w obu
      // console.log(M_transformation)
      return M_transformation;
    })

    // console.log('transform matrix about to be returned')
    // return M_transformation;
    return promise;
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
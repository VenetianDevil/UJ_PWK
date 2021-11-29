var triangles = [];
var transformations = []
  
console.log(triangles)

var transformation_1 = new Transformation(
  new Triangle(new Point(0,0), new Point(0, 10), new Point(5, 0)),
  new Triangle(new Point(0.5,10), new Point(5.5, 0), new Point(5.5, 10))
  );
transformations.push(transformation_1);

var transformation_2 = new Transformation(
  new Triangle(new Point(0,0), new Point(0, 10), new Point(5, 0)),
  new Triangle(new Point(-0.5,0), new Point(-0.5, 10), new Point(-5.5, 0))
  );
transformations.push(transformation_2);

var transformation_3 = new Transformation(
  new Triangle(new Point(0,0), new Point(0, 1), new Point(1, 0)),
  new Triangle(new Point(0,0.5), new Point(0.5, 0), new Point(0.5, 1))
  );
transformations.push(transformation_3);

// var first_t =  new Triangle(new Point(0,0), new Point(0, 10), new Point(5, 0));
// first_t.draw()
var base_triangle = new Triangle(new Point(100, 120), new Point(100, 20), new Point(150, 120));
base_triangle.draw()
var base_triangle_for_3 = new Triangle(new Point(100, 220), new Point(100, 120), new Point(200, 220));
base_triangle_for_3.draw()

// transformations.forEach(transformation => {
//   let trianglesToTransform = transformation.findSimilarTriangles(triangles);
  
//   trianglesToTransform.forEach(triangle => {
//     const promise = transformation.match.getTransformationMatrix(triangle);
//     promise.then((result)=>{
//     let M_transformation = result;
//     let transformed = transformation.add.transform(M_transformation)
//     transformed.color = 'yellow';
//     transformed.draw()
//     })
//   });
// });


// do stworzena pasa ciągnącego się w obie strony w nieskończoność

var N = 0

function tranform1(triangle){
  console.log("Transf 1 ", triangle)
  const promise = transformations[0].match.getTransformationMatrix(triangle);
  console.log(promise)
  promise.then((result) => {
    let M_transformation = result;
    let transformed = transformations[0].add.transform(M_transformation)
    transformed.color = 'yellow';
    transformed.draw();
    if (N<8){
      console.log('N ', N)
      tranform2(transformed)
      N++;
    }
  })
}

function tranform2(triangle){
  console.log("Transf 2 ", triangle)
  const promise = transformations[1].match.getTransformationMatrix(triangle);
  console.log(promise)
  promise
  .catch(error=>{
    console.error(error);
  })
  .then((result) => {
    if(result){
      let M_transformation = result;
      let transformed = transformations[1].add.transform(M_transformation)
      transformed.color = 'red';
      transformed.draw();
      if (N<8){
        console.log('N ', N)
        tranform1(transformed);
        N++
      }
    }

  })
}

tranform1(base_triangle)
tranform2(base_triangle);

var repeat = 0
function transform(transformation, triangle){
  console.log("Transf 3 ", triangle)
  const promise = transformation.match.getTransformationMatrix(triangle);
  console.log(promise)
  promise
  .catch(error=>{
    console.error(error);
  })
  .then((result) => {
    if(result){
      let M_transformation = result;
      let transformed = transformation.add.transform(M_transformation)
      transformed.color = '#' + Math.floor(Math.random()*16777215).toString(16);
      transformed.draw();
      if (repeat<10){
        console.log('N ', N)
        transform(transformation, transformed);
        repeat++;
      }
    }

  })
}

transform(transformation_3, base_triangle_for_3);

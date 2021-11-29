class Transformation {
  constructor(left, right){
    this.match = left;
    this.add = right
  }

  findSimilarTriangles(triangles){
    let similarTriangles = [];
    triangles.forEach(triange => {
      let isSimilar = this.match.isSimilarTo(triange)

      if(isSimilar){
        similarTriangles.push(triange)
      }
    });

    return similarTriangles
  }

  show(){
    this.add.color = '#' + Math.floor(Math.random()*16777215).toString(16);
    this.match.draw();
    this.add.draw()
  }
}
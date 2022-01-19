var canvas = document.getElementById('garden_canvas');
var ctx = canvas.getContext('2d');

var project = new Graph();

var garden = new Vertex("garden", {},
  { ratio: [1, 1], upLeft: new Point(0, 0), color: 'transparent' }
);

project.addVertex(garden);
project.draw();

function applyProduction(prod_nr) {
  this.productions[prod_nr].apply(project);
  project.draw()
}
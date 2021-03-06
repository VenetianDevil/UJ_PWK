class Production {
  constructor(id, left) {
    this.id = id;
    this.left_type = left;
    this.right_graph;
    this.right_graph_constructors = [this.constuct_right_graph_0, this.constuct_right_graph_1, this.constuct_right_graph_2, this.constuct_right_graph_3, this.constuct_right_graph_4, this.constuct_right_graph_5];
  }

  //main project graf as attribute
  apply(g) {
    
    var arrFitToChange = g.vertices.filter(vert => vert.type == this.left_type);
    if (arrFitToChange.length > 0){
     
      var toChange = arrFitToChange[Math.floor(Math.random() * arrFitToChange.length)]; //random el that fits to change
      var toChangeId = toChange.id;
      
      this.right_graph = this.right_graph_constructors[this.id](toChange);
      
      let northConnects = [];
      let southConnects = [];
      let eastConnects = [];
      let westConnects = [];

      // przepisanie połączeń z zamienianego wędła na wstawiany podgraf
      this.right_graph.vertices.forEach(vert => {
        if(vert.north.length == 0){
          vert.north = vert.north.concat(toChange.north);
          northConnects.push(vert.id);
        } 
        if (vert.south.length == 0){
          vert.south = vert.south.concat(toChange.south);
          southConnects.push(vert.id);
        } 
        if (vert.east.length == 0){
          vert.east = vert.east.concat(toChange.east);
          eastConnects.push(vert.id);
        } 
        if (vert.west.length == 0){
          vert.west = vert.west.concat(toChange.west);
          westConnects.push(vert.id);
        }
      })

      // usuwanie połączenia z zamieniany węzłem i dodawanie połączeń do nowego grafu
      g.vertices.forEach(vert => {
        if(vert.north.includes(toChangeId)){
          vert.north.splice(vert.north.indexOf(toChangeId), 1);
          vert.north = vert.north.concat(southConnects);
        } else if (vert.south.includes(toChangeId)){
          vert.south.splice(vert.south.indexOf(toChangeId), 1);
          vert.south = vert.south.concat(northConnects);
        } else if (vert.east.includes(toChangeId)){
          vert.east.splice(vert.east.indexOf(toChangeId), 1);
          vert.east = vert.east.concat(westConnects);
        } else if (vert.west.includes(toChangeId)){
          vert.west.splice(vert.west.indexOf(toChangeId), 1);
          vert.west = vert.west.concat(eastConnects);
        }
      })

      // usunięcie zamienianego węzła z grafu i dodanie nowych
      g.vertices.splice(g.vertices.indexOf(toChange), 1);
      g.vertices = g.vertices.concat(this.right_graph.vertices);

      // console.info(g.vertices)

    } else {
      console.error('Nie ma na czym zastosować produkcji');
      let p = document.createElement("p");
      p.textContent = "prod " + this.id + ": Nie ma na czym zastosować produkcji";
      document.getElementById("comments").appendChild(p)
    }

    this.right_graph = null;

  }
  
  constuct_right_graph_0(changingVertex){
    //gorny lewy row zmienianego 
    var x_0 = changingVertex.upLeft.x;
    var y_0 = changingVertex.upLeft.y;
    // prod 1
    var grass1 = new Vertex("grass", {},
      { ratio: [changingVertex.ratio_x / 3, changingVertex.ratio_y], upLeft: new Point(x_0, y_0), color: 'transparent' }
    );
    
    var bridge = new Vertex("bridge", {},
      { ratio: [changingVertex.ratio_x / 3, changingVertex.ratio_y], upLeft: new Point(x_0+((changingVertex.ratio_x * canvas.width) / 3), y_0), color: 'brown' }
    );
    
    var grass2 = new Vertex("grass", {},
      { ratio: [changingVertex.ratio_x / 3, changingVertex.ratio_y], upLeft: new Point(x_0+((2*changingVertex.ratio_x * canvas.width) / 3), y_0), color: 'transparent' }
    );

    var right_graph = new Graph();
    right_graph.addVertex(grass1);
    right_graph.attachVerticleTo(bridge, [grass1.id], ["east"]);
    right_graph.attachVerticleTo(grass2, [bridge.id], ["east"]);

    return right_graph;
  }

  constuct_right_graph_1(changingVertex){
    //gorny lewy row zmienianego 
    var x_0 = changingVertex.upLeft.x;
    var y_0 = changingVertex.upLeft.y;
    var fb_y_ratio = (((canvas.height * changingVertex.ratio_y) - 200) / 2) / canvas.height;
    // prod 1
    var flowerbed1 = new Vertex("flowerbed", {},
      { ratio: [changingVertex.ratio_x / 2, fb_y_ratio], upLeft: new Point(x_0, y_0), color: 'pink' }
    );
    
    var flowerbed2 = new Vertex("flowerbed", {},
      { ratio: [changingVertex.ratio_x / 2, fb_y_ratio], upLeft: new Point(x_0 + ((canvas.width * changingVertex.ratio_x) / 2), y_0), color: 'pink' }
    );
    
    var flowerbed3 = new Vertex("flowerbed", {},
      { ratio: [changingVertex.ratio_x / 2, fb_y_ratio], upLeft: new Point(x_0, y_0 + 200 + (canvas.height * fb_y_ratio)), color: 'pink' }
    );

    var flowerbed4 = new Vertex("flowerbed", {},
      { ratio: [changingVertex.ratio_x / 2, fb_y_ratio], upLeft: new Point(x_0 + ((canvas.width * changingVertex.ratio_x) / 2), y_0 + 200 + (canvas.height * fb_y_ratio)) , color: 'pink' }
    );

    var fountain = new Vertex("fountain", {},
      { ratio: [changingVertex.ratio_x, 200/canvas.height], upLeft: new Point(x_0, y_0 + (canvas.height * fb_y_ratio)), color: 'lightblue' }
    );

    var right_graph = new Graph();
    right_graph.addVertex(fountain);
    right_graph.attachVerticleTo(flowerbed1, [fountain.id], ["north"]);
    right_graph.attachVerticleTo(flowerbed2, [fountain.id, flowerbed1.id], ["north", "east"]);
    right_graph.attachVerticleTo(flowerbed3, [fountain.id], ["south"]);
    right_graph.attachVerticleTo(flowerbed4, [fountain.id, flowerbed3.id], ["south", "east"]);

    return right_graph;
  }

  constuct_right_graph_2(changingVertex){
    //gorny lewy row zmienianego 
    var x_0 = changingVertex.upLeft.x;
    var y_0 = changingVertex.upLeft.y;
    var fb_y_ratio = changingVertex.ratio_y / 5;
    // prod 1
    var flowerbed1 = new Vertex("flowerbed", {},
      { ratio: [changingVertex.ratio_x, fb_y_ratio], upLeft: new Point(x_0, y_0), color: 'pink' }
    );
    
    var flowerbed2 = new Vertex("flowerbed", {},
      { ratio: [changingVertex.ratio_x, fb_y_ratio], upLeft: new Point(x_0,  y_0 + (canvas.height * fb_y_ratio)), color: 'pink' }
    );
    
    var statue = new Vertex("statue", {},
      { ratio: [changingVertex.ratio_x, fb_y_ratio], upLeft: new Point(x_0,  y_0 + (2* canvas.height * fb_y_ratio)), color: 'gray' }
    );

    var flowerbed3 = new Vertex("flowerbed", {},
      { ratio: [changingVertex.ratio_x, fb_y_ratio], upLeft: new Point(x_0, y_0 + (3* canvas.height * fb_y_ratio)) , color: 'pink' }
    );

    var flowerbed4 = new Vertex("flowerbed", {},
      { ratio: [changingVertex.ratio_x, fb_y_ratio], upLeft: new Point(x_0, y_0 + (4*canvas.height * fb_y_ratio)), color: 'pink' }
    );

    var right_graph = new Graph();
    right_graph.addVertex(flowerbed1);
    right_graph.attachVerticleTo(flowerbed2, [flowerbed1.id], ["south"]);
    right_graph.attachVerticleTo(statue, [flowerbed2.id], ["south"]);
    right_graph.attachVerticleTo(flowerbed3, [statue.id], ["south"]);
    right_graph.attachVerticleTo(flowerbed4, [flowerbed3.id], ["south"]);

    return right_graph;
  }

  constuct_right_graph_3(changingVertex){
    //gorny lewy row zmienianego 
    var x_0 = changingVertex.upLeft.x;
    var y_0 = changingVertex.upLeft.y;
    // prod 1
    var roses = new Vertex("roses", {},
      { ratio: [changingVertex.ratio_x, changingVertex.ratio_y], upLeft: new Point(x_0, y_0), color: 'red' }
    );

    var right_graph = new Graph();
    right_graph.addVertex(roses);

    return right_graph;
  }

  constuct_right_graph_4(changingVertex){
    //gorny lewy row zmienianego 
    var x_0 = changingVertex.upLeft.x;
    var y_0 = changingVertex.upLeft.y;
    // prod 1
    var tulips = new Vertex("tulips", {},
      { ratio: [changingVertex.ratio_x, changingVertex.ratio_y], upLeft: new Point(x_0, y_0), color: 'yellow' }
    );

    var right_graph = new Graph();
    right_graph.addVertex(tulips);

    return right_graph;
  }

  constuct_right_graph_5(changingVertex){
    //gorny lewy row zmienianego 
    var x_0 = changingVertex.upLeft.x;
    var y_0 = changingVertex.upLeft.y;
    // prod 1
    var grass1 = new Vertex("grass", {},
      { ratio: [changingVertex.ratio_x / 3, changingVertex.ratio_y], upLeft: new Point(x_0, y_0), color: 'transparent' }
    );
    
    var gazebo = new Vertex("gazebo", {},
      { ratio: [changingVertex.ratio_x / 3, changingVertex.ratio_y], upLeft: new Point(x_0+((changingVertex.ratio_x * canvas.width) / 3), y_0), color: 'purple' }
    );
    
    var grass2 = new Vertex("grass", {},
      { ratio: [changingVertex.ratio_x / 3, changingVertex.ratio_y], upLeft: new Point(x_0+((2*changingVertex.ratio_x * canvas.width) / 3), y_0), color: 'transparent' }
    );

    var right_graph = new Graph();
    right_graph.addVertex(grass1);
    right_graph.attachVerticleTo(gazebo, [grass1.id], ["east"]);
    right_graph.attachVerticleTo(grass2, [gazebo.id], ["east"]);

    return right_graph;
  }

}

this.productions = [];

var prod_0 = new Production(
  0,
  "garden"
)

this.productions.push(prod_0);

var prod_1 = new Production(
  1,
  "grass"
)

this.productions.push(prod_1);

var prod_2 = new Production(
  2,
  "grass"
)

this.productions.push(prod_2);

var prod_3 = new Production(
  3,
  "flowerbed"
)

this.productions.push(prod_3);

var prod_4 = new Production(
  4,
  "flowerbed"
)

this.productions.push(prod_4);

var prod_5 = new Production(
  5,
  "garden"
)

this.productions.push(prod_5);
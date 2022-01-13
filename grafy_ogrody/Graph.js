class Graph {
  constructor() {
    this.vertices = [];
  }

  addVertice(v1) {
    this.vertices.push(v1);
  }

  attachVerticleTo(new_v, to_v_ids, on_side) {
    for (let i = 0; i<to_v_ids.length; i++){
      var to_ver = this.vertices.find(ver => ver.id == to_v_ids[i]);

      if (on_side == "north") {
        to_ver.north.push(new_v.id);
        new_v.south.push(to_ver.id);
      }
      else if (on_side == "south") {
        to_ver.south.push(new_v.id);
        new_v.north.push(to_ver.id);
      }
      else if (on_side == "east") {
        to_ver.east.push(new_v.id);
        new_v.west.push(to_ver.id);
      }
      else if (on_side == "west") {
        to_ver.west.push(new_v.id);
        new_v.east.push(to_ver.id);
      }

      // console.log(to_ver);
      // console.log(this.vertices.find(ver => ver.id == to_v_ids[i]));
    }
    this.addVertice(new_v);
  }

  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.vertices.forEach(vertice => {
      vertice.draw();
    });
  }

}
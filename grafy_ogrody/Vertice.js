var v_id = 1;

class Vertice {
  constructor(type, edges_to, instructions) {
    this.id = v_id++;
    this.type = type;

    this.north = edges_to.north || []; // gora
    this.east = edges_to.east || []; // prawo
    this.south = edges_to.south || []; // dol
    this.west = edges_to.west || []; // lewo

    console.info("instr: ", instructions)
    console.info(instructions.ratio[0])
    this.ratio_x = instructions.ratio ? instructions.ratio[0] : null; // 0-1
    console.info(this.ratio_x)
    this.ratio_y = instructions.ratio ? instructions.ratio[1] : null; // 0-1
    this.upLeft = instructions.upLeft; // center of the symbol obj
    this.color = instructions.color;
  }
  
  draw() {
    var x_move = (canvas.width * this.ratio_x);
    var y_move = (canvas.height * this.ratio_y);

    ctx.beginPath();
      
    ctx.rect(this.upLeft.x, this.upLeft.y, x_move, y_move);
    ctx.fillStyle = this.color;
    ctx.fill();

    ctx.closePath();

  }
}
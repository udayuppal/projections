window.onload = function () {
  //original loading in of canvas and context
  var CVS = document.getElementById("projections");
  var CTX = CVS.getContext("2d");

  var ELEMS = [];
  var counter = 0;
  var hue = Math.floor(Math.random() * 360);

  const FPS = 100;
  const SPEED_CONSTANT = 50;
  const STD_LINE_WIDTH = 3;
  const NUM_ELEMS = 30;
  const MIN_RAD = 15;
  const MAX_RAD = 35;
  const MAX_VEL = 10;
  const MIN_VEL = -10;
  const SAT = 80;
  const LOW_LIGHT = 30;
  const HIGH_LIGHT = 70;
  const COLOR_CHANGE = 50;
  const BG = "black";

  function element(x, y, vel_x, vel_y, rad, lightness) {
    this.x = x;
    this.y = y;
    this.vel_x = vel_x;
    this.vel_y = vel_y;
    this.rad = rad;
    this.color = "hsl( " + hue + ", " + SAT + "%, " + lightness + "%)";
    this.update_motion = function () {
      //update position based on velocity
      this.x = this.x + this.vel_x/SPEED_CONSTANT;
      this.y = this.y + this.vel_y/SPEED_CONSTANT;

      //edge collisions
      if (this.x - this.rad < 0) {
        this.vel_x = -1 * this.vel_x;
        this.x = this.rad;
      } else if (this.x + this.rad > CVS.width) {
        this.vel_x = -1 * this.vel_x;
        this.x = CVS.width - this.rad;
      }
      if (this.y - this.rad < 0) {
        this.vel_y = -1 * this.vel_y;
        this.y = this.rad;
      } else if (this.y + this.rad > CVS.height) {
        this.vel_y = -1 * this.vel_y;
        this.y = CVS.height - this.rad;
      }
    }

    //update color
    this.update_color = function () {
      this.color = "hsl( " + hue + ", " + SAT + "%, " + lightness + "%)";
    }

    //draw
    this.draw = function () {
      CTX.beginPath();
      CTX.arc(this.x, this.y, this.rad, 0, 2*Math.PI, false);
      CTX.fillStyle = this.color;
      CTX.fill();
      CTX.closePath();
    }
  }
 
  function generate_coordinate (max, min) {
    return Math.random() * (max - min) + min;
  }
 
  function collisions_i(i, x, y, rad) {
    for (var j = 0; j < i; j++) {
      var dx = x - ELEMS[j].x;
      var dy = y - ELEMS[j].y;
      var dist = Math.sqrt(dx*dx + dy*dy);
      if (dist <= rad + ELEMS[j].rad) {
        return true;
      }
    }
    return false;
  }

  function collide(elem_a, elem_b) {
    var dx = elem_a.x - elem_b.x;
    var dy = elem_a.y - elem_b.y;
    var dist = Math.sqrt(dx*dx + dy*dy);
    if (dist <= elem_a.rad + elem_b.rad) {
      var vel_ax = (elem_a.vel_x * (elem_a.rad – elem_b.rad) + (2 * elem_b.rad * elem_b.vel_x)) / (elem_a.rad + elem_b.rad);
      var vel_ay = (elem_a.vel_y * (elem_a.rad – elem_b.rad) + (2 * elem_b.rad * elem_b.vel_y)) / (elem_a.rad + elem_b.rad);
      var vel_bx = (elem_b.vel_x * (elem_b.rad – elem_a.rad) + (2 * elem_a.rad * elem_a.vel_x)) / (elem_a.rad + elem_b.rad);
      var vel_by = (elem_b.vel_y * (elem_b.rad – elem_a.rad) + (2 * elem_a.rad * elem_a.vel_y)) / (elem_a.rad + elem_b.rad);
      elem_a.vel_x = vel_ax;
      elem_a.vel_y = vel_ay;
      elem_b.vel_x = vel_bx;
      elem_b.vel_y = vel_by;
      elem_a.x = elem_a.x + this.vel_x/SPEED_CONSTANT;
      elem_a.y = elem_a.y + this.vel_y/SPEED_CONSTANT;
      elem_b.x = elem_b.x + this.vel_x/SPEED_CONSTANT;
      elem_b.y = elem_b.y + this.vel_y/SPEED_CONSTANT;
    }
  }

  for (var i = 0; i < NUM_ELEMS; i++) {
    var rad = Math.random() * (MAX_RAD - MIN_RAD) + MIN_RAD;
    var max_x = CVS.width - rad;
    var min_x = rad;
    var max_y = CVS.height - rad;
    var min_y = rad;
    do {
      var x = generate_coordinate(max_x, min_x);
      var y = generate_coordinate(max_y, min_y); 
    } while (collisions_i(i, x, y, rad));
    var vel_x = Math.random() * (MAX_VEL - MIN_VEL) + MIN_VEL;
    var vel_y = Math.random() * (MAX_VEL - MIN_VEL) + MIN_VEL;
    var lightness = Math.random() * (HIGH_LIGHT - LOW_LIGHT) + LOW_LIGHT;
    var bubble = new element(x, y, vel_x, vel_y, rad, lightness);
    ELEMS.push(bubble);
  }

  function main() {
    CTX.clearRect(0, 0, CVS.width, CVS.height);
    CTX.fillStyle = BG;
    CTX.fillRect(0, 0, CVS.width, CVS.height);
    counter++;
    var i, j;

    if (counter % COLOR_CHANGE == 0) {
      hue = (hue + 1) % 360;
      counter = 0;
    }
    for (i = 0; i < ELEMS.length; i++) {
      ELEMS[i].draw();
      ELEMS[i].update_motion();
      ELEMS[i].update_color();
    }
    for (i = 0; i < ELEMS.length; i++) {
      for (j = i+1; j < ELEMS.length; j++) {
        collide(ELEMS[i],ELEMS[j]);
      }
    }

    setTimeout(function() {main();}, 1000/FPS);
  }

  main();
}
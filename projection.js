window.onload = function () {
  //original loading in of canvas and context
  var CVS = document.getElementById("projections");
  var CTX = CVS.getContext("2d");
  var POP = [];
  POP.push(new Audio('pop2.mp3'));
  POP.push(new Audio('pop3.mp3'));

  const FPS = 100;
  const SPEED_CONSTANT = 30;
  const LINE_WIDTH = 1;
  const NUM_ELEMS = 25;
  const MIN_RAD = 15;
  const MAX_RAD = 35;
  const MAX_VEL = 10;
  const MIN_VEL = -10;
  const SAT = 80;
  const LOW_LIGHT = 30;
  const HIGH_LIGHT = 70;
  const COLOR_CHANGE = 50;
  const BURST_CONSTANT = 1000;
  const BG = "black";

  var ELEMS = [];
  var counter = 0;
  var hue = Math.floor(Math.random() * 360);
  var BURSTS = [];
  var BURST_REMOVE = [];
  var BURST_STROKE = "hsl( " + hue + ", " + SAT + "%, " + (LOW_LIGHT + HIGH_LIGHT)/2 + "%)";

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
      var col_x = ((elem_a.x * elem_b.rad) + (elem_b.x * elem_a.rad)) / (elem_a.rad + elem_b.rad);
      var col_y = ((elem_a.y * elem_b.rad) + (elem_b.y * elem_a.rad)) / (elem_a.rad + elem_b.rad);
      var rad = CVS.width*1.5;
      var which_play = Math.floor(Math.random() * 2);
      POP[which_play].play();
      BURSTS.push(new burst(col_x, col_y, rad));
      var vel_ax = (elem_a.vel_x * (elem_a.rad - elem_b.rad) + (2 * elem_b.rad * elem_b.vel_x)) / (elem_a.rad + elem_b.rad);
      var vel_ay = (elem_a.vel_y * (elem_a.rad - elem_b.rad) + (2 * elem_b.rad * elem_b.vel_y)) / (elem_a.rad + elem_b.rad);
      var vel_bx = (elem_b.vel_x * (elem_b.rad - elem_a.rad) + (2 * elem_a.rad * elem_a.vel_x)) / (elem_a.rad + elem_b.rad);
      var vel_by = (elem_b.vel_y * (elem_b.rad - elem_a.rad) + (2 * elem_a.rad * elem_a.vel_y)) / (elem_a.rad + elem_b.rad);
      elem_a.vel_x = vel_ax;
      elem_a.vel_y = vel_ay;
      elem_b.vel_x = vel_bx;
      elem_b.vel_y = vel_by;
      elem_a.x = elem_a.x + elem_a.vel_x/SPEED_CONSTANT;
      elem_a.y = elem_a.y + elem_a.vel_y/SPEED_CONSTANT;
      elem_b.x = elem_b.x + elem_b.vel_x/SPEED_CONSTANT;
      elem_b.y = elem_b.y + elem_b.vel_y/SPEED_CONSTANT;
    }
  }

  function burst(x, y, rad) {
    this.x = x;
    this.y = y;
    this.rad = 1;
    this.timer = 0;
    this.draw = function () {
      if (this.timer < BURST_CONSTANT) {
        CTX.beginPath();
        CTX.arc(this.x, this.y, this.rad, 0, 2*Math.PI, false);
        CTX.lineWidth = LINE_WIDTH;
        CTX.strokeStyle = BURST_STROKE;
        CTX.stroke();
        CTX.closePath();
        this.rad += rad/BURST_CONSTANT;
        this.timer++;
      } else {
        BURST_REMOVE.push(this);
      }
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
      BURST_STROKE = "hsl( " + hue + ", " + SAT + "%, " + (LOW_LIGHT + HIGH_LIGHT)/2 + "%)";
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
    for (i = 0; i < BURSTS.length; i++) {
      BURSTS[i].draw();
    }
    for (i = 0; i < BURST_REMOVE.length; i++) {
      BURSTS.splice(BURSTS.indexOf(BURST_REMOVE[i]),1);
    }
    BURST_REMOVE = [];

    setTimeout(function() {main();}, 1000/FPS);
  }

  main();
}
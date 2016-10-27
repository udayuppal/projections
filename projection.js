window.onload = function () {
  //original loading in of canvas and context
  var CVS = document.getElementById("projections");
  var CTX = CVS.getContext("2d");

  var ELEMS = [];
  var counter = 0;
  var hue = Math.floor(Math.random() * 360);
  var hue_comp = (hue + 180) % 360;
  var big_ball;

  const FPS = 100;
  const SPEED_CONSTANT = 20;
  const ACC_CONSTANT = 30;
  const STD_LINE_WIDTH = 3;
  const NUM_ELEMS = 50;
  const MIN_RAD = 8;
  const MAX_RAD = 32;
  const MAX_VEL = 10;
  const MIN_VEL = -10;
  const SAT = 80;
  const LOW_LIGHT = 30;
  const HIGH_LIGHT = 70;
  const COLOR_CHANGE = 50;
  const BIG_X = CVS.width/2;
  const BIG_Y = CVS.height/2;
  const BIG_VEL_X = 0;
  const BIG_VEL_Y = 0;
  const BIG_RAD = (MIN_RAD + MAX_RAD);
  const BIG_LIGHT = 50;
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

      //update velocity based on big_ball
      var dx = this.x - big_ball.x;
      var dy = this.y - big_ball.y;
      var square_const = dx*dx + dy*dy;
      this.vel_x += (1/square_const)*ACC_CONSTANT*dx;
      this.vel_y += (1/square_const)*ACC_CONSTANT*dy;
    }
    this.update_color = function () {
      this.color = "hsl( " + hue + ", " + SAT + "%, " + lightness + "%)";
    }
    this.draw = function () {
      CTX.beginPath();
      CTX.arc(this.x, this.y, this.rad, 0, 2*Math.PI, false);
      CTX.fillStyle = this.color;
      CTX.fill();
      CTX.closePath();
    }
  }
  
  function big_element(x, y, rad) {
    this.x = x;
    this.y = y;
    this.rad = rad;
    this.color = "hsl( " + hue_comp + ", " + SAT + "%, " + BIG_LIGHT + "%)";
    this.update_color = function () {
      this.color = "hsl( " + hue_comp + ", " + SAT + "%, " + BIG_LIGHT + "%)";
    }
    this.draw = function () {
      CTX.beginPath();
      CTX.arc(this.x, this.y, this.rad, 0, 2*Math.PI, false);
      CTX.fillStyle = this.color;
      CTX.fill();
      CTX.closePath();
    }
  }

  for (var i = 0; i < NUM_ELEMS; i++) {
    var rad = Math.random() * (MAX_RAD - MIN_RAD) + MIN_RAD;
    var max_x = CVS.width - rad;
    var min_x = rad;
    var max_y = CVS.height - rad;
    var min_y = rad;
    var x = Math.random() * (max_x - min_x) + min_x;
    var y = Math.random() * (max_y - min_y) + min_y;
    var vel_x = Math.random() * (MAX_VEL - MIN_VEL) + MIN_VEL;
    var vel_y = Math.random() * (MAX_VEL - MIN_VEL) + MIN_VEL;
    var lightness = Math.random() * (HIGH_LIGHT - LOW_LIGHT) + LOW_LIGHT;
    var bubble = new element(x, y, vel_x, vel_y, rad, lightness);
    ELEMS.push(bubble);
  }
  big_ball = new big_element(BIG_X, BIG_Y, BIG_RAD);

  function main() {
    CTX.clearRect(0, 0, CVS.width, CVS.height);
    CTX.fillStyle = BG;
    CTX.fillRect(0, 0, CVS.width, CVS.height);
    counter++;

    if (counter % COLOR_CHANGE == 0) {
      hue = (hue + 1) % 360;
      hue_comp = (hue_comp + 1) % 360;
      counter = 0;
    }
    big_ball.draw();
    big_ball.update_color();
    for (var i = 0; i < NUM_ELEMS; i++) {
      ELEMS[i].draw();
      ELEMS[i].update_motion();
      ELEMS[i].update_color();
    }
    
    setTimeout(function() {main();}, 1000/FPS);
  }

  main();
}

window.onload = function () {
  //original loading in of canvas and context
  var CVS = document.getElementById("projections");
  var CTX = CVS.getContext("2d");

  var ELEMS = [];
  var counter = 0;
  var hue = Math.random() * 360;
  
  const FPS = 100;
  const SPEED_CONSTANT = 20;
  const STD_LINE_WIDTH = 3;
  const NUM_ELEMS = 50;
  const MIN_RAD = 8;
  const MAX_RAD = 32;
  const MAX_VEL = 10;
  const MIN_VEL = -10;
  const SAT = 80;
  const LOW_LIGHT = 30;
  const HIGH_LIGHT = 70;
  const COLOR_CHANGE = 20;
  const BG = "black";

  function element(x, y, vel_x, vel_y, rad, lightness) {
    this.x = x;
    this.y = y;
    this.vel_x = vel_x;
    this.vel_y = vel_y;
    this.rad = rad;
    this.color = "hsl( " + hue + ", " + SAT + "%, " + lightness + "%)";
    this.update_motion = function () {
      this.x = this.x + this.vel_x/SPEED_CONSTANT;
      this.y = this.y + this.vel_y/SPEED_CONSTANT;
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

  function main() {
    CTX.clearRect(0, 0, CVS.width, CVS.height);
    CTX.fillStyle = BG;
    CTX.fillRect(0, 0, CVS.width, CVS.height);
    counter++;

    for (var i = 0; i < NUM_ELEMS; i++) {
      ELEMS[i].draw();
      ELEMS[i].update_motion();
      if (counter % COLOR_CHANGE == 0) {
        hue = (hue + 1) % 360;
        ELEMS[i].update_color();
        counter = 0;
      }
    }
    console.log(ELEMS[0].x, ELEMS[0].y, ELEMS[0].vel_x, ELEMS[0].vel_y);
    
    setTimeout(function() {main();}, 1000/FPS);
  }

  main();
}

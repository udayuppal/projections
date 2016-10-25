window.onload = function () {
  //original loading in of canvas and context
  var CVS = document.getElementById("projections");
  var CTX = CVS.getContext("2d");

  var ELEMS = [];
  
  const FPS = 100;
  const SPEED_CONSTANT = 20;
  const STD_LINE_WIDTH = 3;
  const NUM_ELEMS = 30;
  const MIN_RAD = 8;
  const MAX_RAD = 32;
  const MAX_VEL = 10;
  const MIN_VEL = -10;
  const BG = "black";

  function element(x, y, vel_x, vel_y, rad, color) {
    this.x = x;
    this.y = y;
    this.vel_x = vel_x;
    this.vel_y = vel_y;
    this.rad = rad;
    this.color = color;
    this.complement = ('#FFFFFF' ^ this.color);
    this.update_motion = function () {
      this.x = this.x + vel_x/SPEED_CONSTANT;
      this.y = this.y + vel_y/SPEED_CONSTANT;
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
      this.color = this.color;
    }
    this.draw = function () {
      CTX.beginPath();
      CTX.arc(this.x, this.y, this.rad, 0, 2*Math.PI, false);
      CTX.fillStyle = this.color;
      CTX.fill();
      CTX.strokeStyle = this.complement;
      CTX.stroke;
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
    var color = "#ABC123";
    var bubble = new element(x, y, vel_x, vel_y, rad, color);
    ELEMS.push(bubble);
  }

  function main() {
    CTX.clearRect(0, 0, CVS.width, CVS.height);
    CTX.fillStyle = BG;
    CTX.fillRect(0, 0, CVS.width, CVS.height);
 
    for (var i = 0; i < NUM_ELEMS; i++) {
      ELEMS[i].draw();
      ELEMS[i].update_motion();
      ELEMS[i].update_color();
    }
    console.log(ELEMS[0].x, ELEMS[0].y, ELEMS[0].vel_x, ELEMS[0].vel_y);
    
    setTimeout(function() {main();}, 1000/FPS);
  }

  main();
}

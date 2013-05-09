(function(exports){
  var start_time, start_pos, target, total_time, i_target,
    z_up = -160,
    z_down = -170,
    speed = 20;

  painting = false;
  moving = false;
  x = 0;
  y = 0;

  start = function () {
    start_time = new Date();
    start_pos = $V([position()[1], position()[2], position()[3]]);
    target = $V([x, y, painting ? z_down : z_up]);
    i_target = start_pos;
    total_time = target.distanceFrom(start_pos) / speed;

    var loop = setInterval(function () {
      if (moving || painting) { move(); go(i_target.x, i_target.y, i_target.z); }
      if (i_target.distanceFrom(target) == 0) { clearInterval(loop); }
    }, speed);
  }
  start();

  move = function() {
    var pct_completed = ((new Date()) - start_time) / total_time;
    i_target = target.subtract(start_pos).multiply(pct_completed).add(start_pos);
  }

  exports.paint_to = function (x_pos, y_pos) { painting = true; x = x_pos; y = y_pos; }
  exports.move_to = function (x_pos, y_pos) { moving = true; x = x_pos; y = y_pos; }
  exports.refill = function () { refill = true; }
}(typeof exports === 'undefined' ? this.ik = {} : exports));
(function(exports){
  var PNG = require('png-js');

  var start_time, start_pos, target, total_time, i_target,
    z_up = -160,
    z_down = -170,
    speed = 20;

  painting = false;
  moving = false;
  x = 0;
  y = 0;
  moveQueue = [];
  tickTime = 10;

  exports.currentX = function () { position()[1]; }
  exports.currentY = function () { position()[2]; }
  exports.currentZ = function () { position()[3]; }

  exports.G0 = function (x, y, z) {
    // LONGEST linear path from here to there, ignoring z
    if (moveQueue.length) {
      lastMove = moveQueue[moveQueue.length - 1];
      startX = lastMove[0];
      startY = lastMove[1];
      startZ = lastMove[2];
    } else {
      pos = position()
      startX = pos[1];
      startY = pos[2];
      startZ = pos[3];
    }

    xDist = Math.abs(startX - x);
    yDist = Math.abs(startY - y);
    zDist = Math.abs(startZ - z);

    // should I even include zDist in here?
    distance = Math.max(xDist, yDist, zDist);

    // console.log("---");
    // console.log(startX, startY, startZ, x, y ,z);
    // console.log(xDist, yDist, zDist);
    // console.log("---");

    for (var i=0; i<distance; i++) {
      var pct = i/distance;
      // console.log("adding");
      moveQueue.push([i * ((x - startX)/distance) + startX, i * ((y - startY)/distance) + startY, i * ((z - startZ)/distance) + startZ]);
      // console.log([i * ((x - startX)/distance) + startX, i * ((y - startY)/distance) + startY, i * ((z - startZ)/distance) + startZ]);
    }
  }

  // start the movement thing
  exports.magic = setInterval(function () {
    if (moveQueue.length) {
      currentMove = moveQueue.shift();
      go(currentMove[0], currentMove[1], currentMove[2]);
      // console.log(currentMove[0], currentMove[1], currentMove[2]);
    }
  }, tickTime);
  // which is absolute, g1 or g0?
  // exports.G0 = function (x, y, howLong) {
  //   moveQueue.push({
  //     "startTime": null,
  //     "endTime": null,
  //     "howLong": howLong,
  //     "x": x,
  //     "y": y,
  //     "start": function () {
  //       this.startTime = new Date();
  //       this.startX = currentX();
  //       this.startY = currentY();
  //       this.xDistance = this.startX - this.x;
  //       this.yDistance = this.startY - this.y;
  //     },
  //     "tick": function (percentOfTime) {
  //       percentOfX = this.xDistance * percentOfTime;
  //       newX = this.startX - percentOfX;

  //       percentOfY = this.yDistance * percentOfTime;
  //       newY = this.startY - percentOfY;

  //       go(newX, newY, currentZ)
  //     }
  //   });
  // }

  // exports.magic = function () {
  //   if (!currentMove) {
  //     if (moveQueue.length) {
  //       currentMove = moveQueue.pop();
  //     }
  //   }

  //   if (currentMove) {
  //     if (!currentMove.startTime) {
  //       currentMove.start();
  //     }

  //     percentOfTime = (new Date()) - currentMove.startTime() / currentMove.howLong;
  //     currentMove.tick(currentMove.startTime(percentOfTime));
  //   }
  // }

  start = function () {
    start_time = new Date();
    start_pos = $V([position()[1], position()[2], position()[3]]);
    target = $V([x, y, painting ? z_down : z_up]);
    i_target = start_pos;
    total_time = target.distanceFrom(start_pos) / speed;

    var loop = setInterval(function () {
      if (!currentMove && !moveQueue.length) {
        currentMove = moveQueue.pop();
      }

      if (moving || painting) { move(); go(i_target.x, i_target.y, i_target.z); }
      if (i_target.distanceFrom(target) == 0) { clearInterval(loop); }
    }, speed);
  }
  //setTimeout(start, 10000);

  move = function() {
    var pct_completed = ((new Date()) - start_time) / total_time;
    i_target = target.subtract(start_pos).multiply(pct_completed).add(start_pos);
  }

  exports.paint_to = function (x_pos, y_pos) { painting = true; x = x_pos; y = y_pos; }
  exports.move_to = function (x_pos, y_pos) { moving = true; x = x_pos; y = y_pos; }
  exports.refill = function () { refill = true; }


  exports.drawObey = function () {
    timeOffset = 0;
    timeDelay = 100;
    perXTime = 10;

    obey = PNG.load('./obey.png');
    obey.decode(function (data) {
      for (y = 0; y < obey.height; y++) {
        setTimeout(function () { go(0, y - 40, z_up); }, (timeOffset += timeDelay));
        str = "";
        if (y % 2 == 1) {
          fromX = obey.width;
          toX = 1;
          xDir = -1;
        } else {
          fromX = 0;
          toX = obey.width - 1;
          xDir = +1;
        }
        for (x=fromX; x != toX; x+=xDir) {
          offset = (y * obey.width * 4) + (x * 4);
          r = data[offset];
          g = data[offset+1];
          b = data[offset+2];
          a = data[offset+3];
          val = (r+g+b) / 3;
          if(val > 120) {
            exports.G0(x - 40, y - 40, z_up);
            str += " "
          } else {
            exports.G0(x - 40, y - 40, z_down);
            str += "*"
          }
        }
        console.log(str);
        // return;
      }
    });
  }
}(typeof exports === 'undefined' ? this.paint = {} : exports));
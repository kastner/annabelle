(function(exports){
  var PNG = require('png-js');

  var start_time, start_pos, target, total_time, i_target,
    z_up = -153,
    z_down = -163,
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

    distance = Math.max(xDist, yDist, zDist);

    for (var i=0; i<distance; i++) {
      moveQueue.push([i * ((x - startX)/distance) + startX, i * ((y - startY)/distance) + startY, i * ((z - startZ)/distance) + startZ]);
    }
  }

  // start the movement thing
  exports.magic = setInterval(function () {
    if (moveQueue.length) {
      currentMove = moveQueue.shift();
      go(currentMove[0], currentMove[1], currentMove[2]);
    }
  }, tickTime);

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

          // get some more paint
          exports.G0(x - 40, y - 40, -130);
          exports.G0(70, -5, -130);
          exports.G0(50, -15, -160);
          exports.G0(70, -5, -130);
          exports.G0(x - 40, y - 40, -130);
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
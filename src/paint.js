(function(exports){
  var fs = require('fs');
  // var PNG = require('png-js');
  var PNG = require('pngjs').PNG;

  painting = false;
  moving = false;
  x = 0;
  y = 0;
  moveQueue = [];

  options = {
    zUp: -153,
    zDown: -163,
    tickTime: 5,
    xOffset: -40,
    yOffset: -40,
    getPaint: 2
  }

  exports.options = options;

  exports.useMagBot = function () {
    // ik.updateSize()

    // pen
    options.zDown = -174.2;
    options.zUp = -170.4;

    // pencil
    // options.zDown = -167.2;
    // options.zUp = -162.4;
    options.getPaint = false;
    options.tickTime = 3;
  }

  exports.currentX = function () { position()[1]; }
  exports.currentY = function () { position()[2]; }
  exports.currentZ = function () { position()[3]; }

  exports.lastPosition = function () {
    if (moveQueue.length) {
      return moveQueue[moveQueue.length - 1];
    } else {
      return position().slice(1, 4);
    }
  }

  exports.G0 = function (x, y, z) {
    // LONGEST linear path from here to there, ignoring z
    lastMove = exports.lastPosition();
    startX = lastMove[0];
    startY = lastMove[1];
    startZ = lastMove[2];

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
  }, options.tickTime);

  exports.drawObey = function () {
    exports.drawPng('obey');
  }

  exports.drawPng = function (name) {
    timeOffset = 0;
    timeDelay = 100;
    perXTime = 10;

    fs.createReadStream('./' + name + '.png')
      .pipe(new PNG({filterType: 4}))
      .on('parsed', function() {

    // aPng = PNG.load('./' + name + '.png');
    // aPng.decode(function (data) {
      // console.log(aPng);
      console.log(this);
      // colorCount = aPng.colors;
      // if (aPng.hasAlphaChannel) { colorCount += 1; }
      // for (y = 0; y < aPng.height; y++) {
      for (y = 0; y < this.height; y++) {
        str = "";

        if (y % 2 == 1) {
          // fromX = aPng.width;
          fromX = this.width;
          toX = 0;
          xDir = -1;
        } else {
          fromX = 0;
          // toX = aPng.width;
          toX = this.width;
          xDir = +1;

          if (options.getPaint && options.getPaint == 2) {
            // get some more paint
            exports.G0(x - 40, y - 40, -130);
            exports.G0(70, -5, -130);
            exports.G0(50, -15, -160);
            exports.G0(70, -5, -130);
            exports.G0(x - 40, y - 40, -130);
          }
        }

        for (x=fromX; x != toX; x+=xDir) {
          // offset = (y * aPng.width * colorCount) + (x * colorCount);
          // offset = (aPng.width * y + x) << 2;
          offset = (this.width * y + x) << 2;
          // var cValue = 0;
          // for (cc=0; cc<=colorCount; cc++) { cValue += data[offset + cc]; }
          // val = cValue / colorCount;
          // if(data[offset] < 225) {
          if(this.data[offset] > 240) {
            exports.G0(x + options.xOffset, y + options.yOffset, options.zUp);
            str = (xDir == 1) ? str + " " : " " + str;
          } else {
            exports.G0(x + options.xOffset, y + options.yOffset, options.zDown);
            str = (xDir == 1) ? str + "#" : "#" + str;
          }
        }
        console.log(str);
        // return;
      }
      exports.G0(0, 0, options.zUp);
    });
  }
}(typeof exports === 'undefined' ? this.paint = {} : exports));
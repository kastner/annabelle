var fs = require('fs');
var paint = require('./paint.js');

var offsets = {
  'X': -40,
  'Y': -40,
  'Z': -159
};

(function(exports) {
  // this should use streaming:
  // http://stackoverflow.com/questions/6831918/node-js-read-a-text-file-into-an-array-each-line-an-item-in-the-array
  exports.processFile = function (fName) {
    fs.readFile(__dirname + '/../' + fName, function(err, data) {
      if (err) { console.log(err); }
      console.log(data);
      data.toString().split("\n").forEach(function (line) {
        var parts = line.split(/\s+/);
        // The only command we support currenlty
        if (parts.shift() == "G0") {
          lastMove = paint.lastPosition();
          xyz = {'X': lastMove[0], 'Y': lastMove[1], 'Z': lastMove[2]};
          parts.forEach(function (part) {
            if ((matches = part.match(/([xyzXYZ])([\d\.\-]+)/))) {
              xyz[matches[1]] = parseFloat(matches[2]) + offsets[matches[1]];
            }
          });
          // console.log(xyz);
          paint.G0(xyz['X'], xyz['Y'], xyz['Z']);
        }
      });
    });
  }
}(typeof exports === 'undefined' ? this.gcode = {} : exports));
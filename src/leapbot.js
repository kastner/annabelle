(function(exports){
  Leap = require('leapjs').Leap;

  var handIdx = null,
    originHand = null,
    originHandPosition = null,
    currentHand = null,
    currentHandPosition = null,
    gridPosition;

  exports.getPosition = function () { return gridPosition; }

  Leap.loop(function(frame) {

    // experiment using just palmNormal
    var handIdxs = Object.keys(frame.handsMap); 
    hand = frame.handsMap[handIdxs[0]];
    if (hand) {
      console.log(handIdxs.length);
      gridPosition = hand.palmNormal;
      gridPosition.x = 10 * gridPosition.x;
      gridPosition.y = 10 * gridPosition.y;
      gridPosition.z = 10 * gridPosition.z;
    } else {
      gridPosition = null;
    }
    console.log(gridPosition)
    return true;


    var handIdxs = Object.keys(frame.handsMap); 
    
    console.log("\033[2J\033[0f") // clear screen
  
    // console.log("Length", handIdxs)
    if (handIdx && handIdxs.length === 0) {
      // console.log("RESET 1", handIdx)
      handIdx = null;
      originHand = null;
      originHandPosition = null;
    } else if (!handIdx && handIdxs.length) {
      // console.log("RESET 2 idx", handIdxs.length)
      handIdx = handIdxs[0];
      originHand = frame.handsMap[handIdx];
      originHandPosition = originHand.sphereCenter;
    }

    console.log(handIdx); //, frame.handsMap);
    
    if (handIdx && frame.handsMap[handIdx]) {
      currentHand = frame.handsMap[handIdx];
      console.log(currentHand.sphereCenter, 'mph')
      console.log(currentHand.palmNormal, 'norm')
      currentHandPosition = currentHand.sphereCenter;
      console.log("-->", currentHandPosition, originHandPosition)

      diffX = (currentHandPosition.x - originHandPosition.x);
      diffY = (currentHandPosition.y - originHandPosition.y);
      diffZ = (currentHandPosition.z - originHandPosition.z);

      // If there are crazy adjustments then reset the original position
      if (Math.abs(diffX) > 50 || Math.abs(diffY) > 50 || Math.abs(diffZ) > 50) {
        console.log("RESETTING")
        originHand = currentHand;
        originHandPosition = currentHandPosition;
        diffX = 0;
        diffY = 0;
        diffZ = 0;
      } 

      // Do logic with printer;
      console.log("X diff:", diffX);
      console.log("Y diff:", diffY);
      console.log("Z diff:", diffZ);

      // console.log("direction", currentHand.direction)
      // console.log("palmVelocity", currentHand.palmVelocity)
      // console.log("palmNormal", currentHand.palmNormal)
      // console.log("sphereCenter", currentHand.sphereCenter)
      // console.log("sphereRadius", currentHand.sphereRadius)
      // console.log("rotation", currentHand.rotation)
      // console.log("->", originHandPosition, currentHandPosition)
    }

//   handsMap: 
//    { '3': 
//       { id: 3,
//         palmPosition: [Object],
//         direction: [Object],
//         palmVelocity: [Object],
//         palmNormal: [Object],
//         sphereCenter: [Object],
//         sphereRadius: 107.239,
//         valid: true,
//         pointables: [],
//         fingers: [],
//         tools: [],
//         _translation: [Object],
//         rotation: [Object],
//         _scaleFactor: 1.03776,
//         frame: [Circular] } },
    //   }
    // }

  })
}(typeof exports === 'undefined' ? this.ik = {} : exports));


// { valid: true,
//   id: 26143,
//   timestamp: 597785966,
//   hands: [],
//   handsMap: {},
//   pointables: 
//    [ { valid: true,
//        id: 15,
//        handId: -1,
//        length: 50.5624,
//        tool: false,
//        width: undefined,
//        direction: [Object],
//        tipPosition: [Object],
//        tipVelocity: [Object],
//        frame: [Circular] } ],
//   tools: [],
//   fingers: 
//    [ { valid: true,
//        id: 15,
//        handId: -1,
//        length: 50.5624,
//        tool: false,
//        width: undefined,
//        direction: [Object],
//        tipPosition: [Object],
//        tipVelocity: [Object],
//        frame: [Circular] } ],
//   gestures: [],
//   pointablesMap: 
//    { '15': 
//       { valid: true,
//         id: 15,
//         handId: -1,
//         length: 50.5624,
//         tool: false,
//         width: undefined,
//         direction: [Object],
//         tipPosition: [Object],
//         tipVelocity: [Object],
//         frame: [Circular] } },
//   _translation: { x: -2.3855, y: -191.757, z: 224.034 },
//   rotation: 
//    { xBasis: { x: 0.788707, y: 0.578154, z: 0.208996 },
//      yBasis: { x: -0.355735, y: 0.706465, z: -0.61185 },
//      zBasis: { x: -0.501392, y: 0.408223, z: 0.762863 },
//      origin: { x: 0, y: 0, z: 0 } },
//   _scaleFactor: 5.7577,
//   data: 
//    { hands: [],
//      id: 26143,
//      pointables: [ [Object] ],
//      r: [ [Object], [Object], [Object] ],
//      s: 5.7577,
//      t: [ -2.3855, -191.757, 224.034 ],
//      timestamp: 597785966 },
//   type: 'frame',
//   controller: 
//    { opts: 
//       { frameEventName: 'connectionFrame',
//         host: '127.0.0.1',
//         enableGestures: false,
//         port: 6437 },
//      history: { pos: 992, _buf: [Object], size: 200 },
//      lastFrame: [Circular],
//      lastValidFrame: [Circular],
//      lastConnectionFrame: [Circular],
//      connection: 
//       { host: '127.0.0.1',
//         port: 6437,
//         _events: [Object],
//         socket: [Object],
//         protocol: [Object],
//         gesturesEnabled: false },
//      accumulatedGestures: [],
//      _events: { connectionFrame: [Object] } },
//   historyIdx: 991 }

// { valid: true,
//   id: 22990,
//   timestamp: 583022229,
//   hands: 
//    [ { id: 3,
//        palmPosition: [Object],
//        direction: [Object],
//        palmVelocity: [Object],
//        palmNormal: [Object],
//        sphereCenter: [Object],
//        sphereRadius: 107.239,
//        valid: true,
//        pointables: [],
//        fingers: [],
//        tools: [],
//        _translation: [Object],
//        rotation: [Object],
//        _scaleFactor: 1.03776,
//        frame: [Circular] } ],
//   handsMap: 
//    { '3': 
//       { id: 3,
//         palmPosition: [Object],
//         direction: [Object],
//         palmVelocity: [Object],
//         palmNormal: [Object],
//         sphereCenter: [Object],
//         sphereRadius: 107.239,
//         valid: true,
//         pointables: [],
//         fingers: [],
//         tools: [],
//         _translation: [Object],
//         rotation: [Object],
//         _scaleFactor: 1.03776,
//         frame: [Circular] } },
//   pointables: 
//    [ { valid: true,
//        id: 7,
//        handId: -1,
//        length: 52.6137,
//        tool: false,
//        width: undefined,
//        direction: [Object],
//        tipPosition: [Object],
//        tipVelocity: [Object],
//        frame: [Circular] } ],
//   tools: [],
//   fingers: 
//    [ { valid: true,
//        id: 7,
//        handId: -1,
//        length: 52.6137,
//        tool: false,
//        width: undefined,
//        direction: [Object],
//        tipPosition: [Object],
//        tipVelocity: [Object],
//        frame: [Circular] } ],
//   gestures: [],
//   pointablesMap: 
//    { '7': 
//       { valid: true,
//         id: 7,
//         handId: -1,
//         length: 52.6137,
//         tool: false,
//         width: undefined,
//         direction: [Object],
//         tipPosition: [Object],
//         tipVelocity: [Object],
//         frame: [Circular] } },
//   _translation: { x: 10.1624, y: -224.901, z: 87.5111 },
//   rotation: 
//    { xBasis: { x: 0.588511, y: 0.674533, z: 0.445713 },
//      yBasis: { x: -0.39129, y: 0.720058, z: -0.573069 },
//      zBasis: { x: -0.707493, y: 0.162854, z: 0.687701 },
//      origin: { x: 0, y: 0, z: 0 } },
//   _scaleFactor: 4.56027,
//   data: 
//    { hands: [ [Object] ],
//      id: 22990,
//      pointables: [ [Object] ],
//      r: [ [Object], [Object], [Object] ],
//      s: 4.56027,
//      t: [ 10.1624, -224.901, 87.5111 ],
//      timestamp: 583022229 },
//   type: 'frame',
//   controller: 
//    { opts: 
//       { frameEventName: 'connectionFrame',
//         host: '127.0.0.1',
//         enableGestures: false,
//         port: 6437 },
//      history: { pos: 1, _buf: [Object], size: 200 },
//      lastFrame: [Circular],
//      lastValidFrame: [Circular],
//      lastConnectionFrame: [Circular],
//      connection: 
//       { host: '127.0.0.1',
//         port: 6437,
//         _events: [Object],
//         socket: [Object],
//         protocol: [Object],
//         gesturesEnabled: false },
//      accumulatedGestures: [],
//      _events: { connectionFrame: [Object] } },
//   historyIdx: 0 }
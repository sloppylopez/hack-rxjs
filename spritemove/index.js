var lastEvent,
    plane = $('div.test'),
    currentX = 0,
    currentY = 0;
console.log(currentY)

var keyMap = {
  '37' : 'left',
  '38' : 'up',
  '39' : 'right',
  '40' : 'down'
}
document.querySelector('body').addEventListener('keydown', function(e) {
  lastEvent = e;

});


var widgetX = new Rx.Subject();
widgetX.subscribe(function(result) {
  console.log(result)
});

var widgetY = new Rx.Subject();
widgetY.subscribe(function(result) {
  console.log(result)
});


var keysDown = Rx.Observable
    .fromEvent($('body'), 'keydown')
    .filter(function(e) {
      return [37, 38, 39, 40].indexOf(e.keyCode) !== -1;
    }).map(function(e) {
      console.log(e);
      return keyMap[e.keyCode + ''];
    });

var keysUp = Rx.Observable
    .fromEvent($('body'), 'keyup')
    .filter(function(e) {
      return [37, 38, 39, 40].indexOf(e.keyCode) !== -1;
    }).map(function(e) {
      console.log(e);
      return keyMap[e.keyCode + ''];
    });

var moveX = keysDown.filter(function(value) {
  return value === 'left' || value == 'right'
}).subscribe(function(value) {
  if(value === 'left') {
    widgetX.onNext(-1);
  } else {
    widgetX.onNext(1);
  }
})


var moveY = keysDown.filter(function(value) {
  return value === 'up' || value == 'down'
}).subscribe(function(value) {
  if(value === 'up') {
    widgetY.onNext(-1);
  } else {
    widgetY.onNext(1);
  }
})

widgetX.subscribe(function(val) {
  currentX += val;
  toPosition( currentX, currentY);
})

widgetY.subscribe(function(val) {
  currentY += val;
  toPosition( currentX, currentY);
})

//

$('body').on('keyup', function(e) {
  lastEvent = e;
});

/*
 function animation() {
 toPosition(currentX, currentY);
 }
 */
function toPosition(x, y) {
  plane.css({
    'top': y,
    'left': x
  });
}


//function draw() {
//    requestAnimationFrame(draw);
//}
//draw();
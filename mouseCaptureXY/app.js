(function() {

  function extractClientX(e) {
    return e.clientX;
  }

  function extractClientY(e) {
    return e.clientY;
  }

  function checkHorizontalMoves(x) {
    horizontal.innerHTML = 'Horizontal: ' + x
  }

  function checkVerticalMoves(y) {
    vertical.innerHTML = 'Vertical: ' + y
  }

  function writeInConsole() {
    console.log('We are moving the mouse');
  }

  var mousemove = Rx.Observable.fromEvent(document, 'mousemove');
  var horizontal = document.getElementById('horizontal');
  var vertical = document.getElementById('vertical');
  var movingVertical = mousemove.map(extractClientX);
  var movingHorizontal = mousemove.map(extractClientY);
  // Update the mouse
  movingVertical
      .map(checkVerticalMoves)
      .subscribe(writeInConsole);

  movingHorizontal
      .map(checkHorizontalMoves)
      .subscribe(writeInConsole);
}());
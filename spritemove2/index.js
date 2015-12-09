var plane = $('div.test'),
    currentX = 0,
    currentY = 0,
    speed = 3;

var keyMap = {
  '37': 'left',
  '38': 'up',
  '39': 'right',
  '40': 'down'
};

var keysDown = Rx.Observable
    .fromEvent($('body'), 'keydown')
    .filter(e => [37, 38, 39, 40].indexOf(e.keyCode) !== -1)
    .map(e => '1_' + keyMap[e.keyCode + '']);

var keysUp = Rx.Observable
    .fromEvent($('body'), 'keyup')
    .filter(e => [37, 38, 39, 40].indexOf(e.keyCode) !== -1)
    .map(e => '0_' + keyMap[e.keyCode + '']);

var startGoLeft = keysDown.filter(value => value === '1_left');
var stopGoLeft = keysUp.filter(value => value === '0_left');
var goLeft = Rx.Observable.merge(startGoLeft, stopGoLeft).distinctUntilChanged();

var startGoRight = keysDown.filter(value =>value === '1_right');
var stopGoRight = keysUp.filter(value => value === '0_right');
var goRight = Rx.Observable.merge(startGoRight, stopGoRight).distinctUntilChanged();

var dirHR = Rx.Observable.combineLatest(
    Rx.Observable.merge(goLeft, Rx.Observable.from(['0']))
        .map(val => val.substr(0, 1) === '0' ? 0 : -1),
    Rx.Observable.merge(goRight, Rx.Observable.from(['0']))
        .map(val => val.substr(0, 1) === '0' ? 0 : 1)
).map(actions => actions[0] + actions[1]);

var startGoUp = keysDown.filter(value => value === '1_up');
var stopGoUp = keysUp.filter(value => value === '0_up');
var goUp = Rx.Observable.merge(startGoUp, stopGoUp).distinctUntilChanged();

var startGoDown = keysDown.filter(value =>value === '1_down');
var stopGoDown = keysUp.filter(value => value === '0_down');
var goDown = Rx.Observable.merge(startGoDown, stopGoDown).distinctUntilChanged();

var dirVR = Rx.Observable.combineLatest(
    Rx.Observable.merge(goUp, Rx.Observable.from(['0']))
        .map(val => val.substr(0, 1) === '0' ? 0 : -1),
    Rx.Observable.merge(goDown, Rx.Observable.from(['0']))
        .map(val => val.substr(0, 1) === '0' ? 0 : 1)
).map(actions => actions[0] + actions[1]);

var dir = Rx.Observable.combineLatest(dirHR, dirVR);

var newPositionEvent = new Rx.Subject();
var newPosition = Rx.Observable.combineLatest(dir, newPositionEvent);

function start() {
  var intervalSource = Rx.Observable.interval(42, Rx.Scheduler.requestAnimationFrame);
  intervalSource.subscribe(draw);
}

function draw() {
  newPositionEvent.onNext(1);
}

newPosition.subscribe(val => {
  currentX += val[0][0] + val[0][0] * speed;
  currentY += val[0][1] + val[0][1] * speed;
  toPosition(currentX, currentY);
});

function toPosition(x, y) {
  plane.css({
    'top': y,
    'left': x
  });
}

start();

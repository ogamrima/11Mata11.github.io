// PAPERSCRIPT //
// autor: Martin Skala
/////////////////////////////////
paper.setup('myCanvas');
var stredPointOfRect = new Point(window.innerWidth / 2, window.innerHeight / 2);
var angle = 0;
var vector = new Point();

var Figurka = new function () {
  var rect = new Rectangle(stredPointOfRect, new Size(20, 15));
  rect.center = stredPointOfRect;
  var rectPath = new Path.Rectangle(rect, new Size(1, 1));
  rectPath.fillColor = "blue";
  rectPath.closed = true;
  rectPath.center = stredPointOfRect;
  var prach = new Path([-8, -4] + stredPointOfRect, [-14, 0] + stredPointOfRect, [-8, 4] + stredPointOfRect);
  prach.strokeColor = "red";
  prach.selected = true;
  var group = new Group(rectPath, prach);
  console.log(stredPointOfRect);
  console.log("Rect stred: " + rect.center);
  console.log("Group stred: " + group.position);
  return {
    angle: 0,
    update: function () {
      vector = new Point({
        angle: angle,
        length: 8
      });
    },
    rotace: function (hodnota) {
      group.rotate(hodnota, group.position);
      angle += hodnota;
      console.log("Uhel:  " + angle);
    },
    move: function () {
      vector = new Point({
        position: group.position + (group.topRight - group.topLeft) / 2,
        angle: angle,
        length: 4
      });
      console.log("Vektor  " + vector + "     " + vector.angle);
      group.position += vector;
    }
  };
}

function Setup() {
  console.log("Velikost stranky: " + paper.view.size);
  // STRED STRANKY
  var pathStredStranky = new Path.Circle(paper.view.center, new Size(1, 1));
  pathStredStranky.center = paper.view.center;
  pathStredStranky.fillColor = "red";
  pathStredStranky.closed
  Figurka.update();
  console.log("Setup: vytvorena figurka");
}



// CASOVAC (kazdych 100 milisekund)
var casovaPromenna = 0;
setInterval(function () {
  //KDYZ UBEHNE 5 setin VTERINY
  if (casovaPromenna == 5) {
    Setup();
  }
  else if (casovaPromenna > 5) {
    Pohyb();
  }
  view.update();
  casovaPromenna += 1;
  //console.log("TIME:  " + casovaPromenna);
}, 100)


function onFrame(event) {
  //Zkontrolovat kolize
  Pohyb();
}

var movement = {
  left: false,
  right: false,
  up: false,
  down: false,
};

function onKeyDown(event) {
  if (event.key == "w" || event.key == "up") {
    movement.up = true;
  }
  if (event.key == "a" || event.key == "left") {
    movement.left = true;
  }
  if (event.key == "s" || event.key == "down") {
    movement.down = true;
  }
  if (event.key == "d" || event.key == "right") {
    movement.right = true;
  }
  view.update();
}

function onKeyUp(event) {
  if (event.key == "w" || event.key == "up") {
    movement.up = false;
  }
  if (event.key == "a" || event.key == "left") {
    movement.left = false;
  }
  if (event.key == "s" || event.key == "down") {
    movement.down = false;
  }
  if (event.key == "d" || event.key == "right") {
    movement.right = false;
  }
  view.update();
}

function Pohyb() {
  if (movement.left) {
    Figurka.rotace(-3);
    //Figurka.turnLeft();
  }
  if (movement.right) {
    Figurka.rotace(3);
    //Figurka.turnRight();
  }
  if (movement.up) {
    Figurka.move();
  }
  if (movement.down) {

  }
}

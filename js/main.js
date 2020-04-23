// PAPERSCRIPT //
// autor: Martin Skala
/////////////////////////////////
paper.setup('myCanvas');
var stredPointOfRect = new Point(paper.view.size.width / 2, paper.view.size.height / 2);

var rectObrazovka = new Rectangle(new Point(0, 0), new Point(paper.view.size.width, paper.view.size.height));
var pathStredStranky = new Path.Circle(paper.view.center, new Size(1, 1));

var presets = {
  snimek: 0,
  cas: 0,
  casPredchozi: 0,
  zivoty: 3,
}

var Figurka = new function () {
  //// Trysky za hrace pri stisknuti klavesy SPACE
  var pohonPath = new Path();
  for (var i = 1; i <= 4; i++) {
    var circlecircle = new Path.Circle(stredPointOfRect - new Point(10, 0) * i, 8 - 2 * i)
    circlecircle.center = stredPointOfRect - [10, 10] * i;
    pohonPath.join(circlecircle);
  }
  pohonPath.position = stredPointOfRect - new Point(20, 0);
  pohonPath.visible = true;
  pohonPath.fillColor = "white";
  pohonPath.closed = true;
  //////////////////////////////
  var rect = new Rectangle(stredPointOfRect, new Size(20, 15));
  rect.center = stredPointOfRect;
  var rectPath = new Path.Rectangle(rect, new Size(1, 1));
  rectPath.fillColor = "blue";
  rectPath.closed = true;
  rectPath.center = stredPointOfRect;
  var group = new Group(pohonPath, rectPath);
  var predchoziGroupPozice = group.position;
  var angle = 0;
  var vector = new Point();
  var particlesPath = [];
  var particlesGroup = new Group();
  return {
    group: group,
    angle: 0,
    update: function () {
      //Snimek se nuluje jen pri stisku klavesy SPACE
      if (presets.snimek > 30) {
        pohonPath.visible = false;
      }
      if (presets.snimek % 100 > 70 && !movement.up) {
        particlesGroup.visible = false;
      }
      particlesGroup.position = group.position - vector * 6;
    },
    particles: function () {
      particlesPath = [];
      particlesGroup.removeChildren();
      for (var i = 1; i <= 5; i++) {
        var circlecircles = new Path.Circle(group.position, 3)
        circlecircles.position = group.position - new Point(20, 20) * Point.random();
        circlecircles.visible = true;
        circlecircles.fillColor = new Color(0, 0., Math.random());;
        circlecircles.closed = true;
        particlesPath.push(circlecircles);
      }
      for (var i = 0; i < particlesPath.length; i++) {
        particlesGroup.addChild(particlesPath[i]);
      }
    },
    rotace: function (hodnota) {
      group.rotate(hodnota, group.position);
      angle += hodnota;
      particlesGroup.visible = true;
    },
    move: function (delkaVektoru) {
      particlesGroup.visible = true;
      vector = new Point({
        position: group.position + (group.topRight - group.topLeft) / 2,
        angle: angle,
        length: delkaVektoru
      });
      predchoziGroupPozice = group.position;
      group.position += vector;
      this.particles();
      this.kontrolaObrazovky();
    },
    dashdash: function (delkaVektoru) {
      this.move(delkaVektoru);
      pohonPath.visible = true;
      movement.space = false;
    },
    kontrolaObrazovky: function () {
      // Jestli se hrac nachazi v hracim poli
      if (!group.isInside(rectObrazovka)) {
        group.position = predchoziGroupPozice;
      }
    }
  };
}


function Setup() {
  console.log("Velikost stranky: " + paper.view.size);
  // STRED STRANKY
  {
    pathStredStranky.center = paper.view.center;
    pathStredStranky.fillColor = "red";
    pathStredStranky.closed
  }
  Figurka.update();
  console.log("Setup: vytvorena figurka");
}

// RESPONSIBLE 
paper.view.onResize = function (event) {
  Figurka.group.position += (event.size - rectObrazovka) * 0.5;
  rectObrazovka = new Rectangle(new Point(0, 0), new Point(paper.view.size.width, paper.view.size.height));
  stredPointOfRect = new Point(paper.view.size.width / 2, paper.view.size.height / 2);
  {
    pathStredStranky.removeSegments();
    pathStredStranky = new Path.Circle(paper.view.center, new Size(1, 1));
    pathStredStranky.center = paper.view.center;
    pathStredStranky.fillColor = "red";
    pathStredStranky.closed
  }

};


// CASOVAC (kazdych 100 milisekund)
setInterval(function () {
  //KDYZ UBEHNE 5 setin VTERINY
  if (presets.cas == 5) {
    Setup();
    presets.cas += 1;
  }
  else if (presets.cas > 5) {
    presets.casPredchozi = presets.cas;
    presets.cas += 1;
    Pohyb();
    presets.casPredchozi = presets.cas;
  }
  else {
    presets.cas += 1;
  }
  view.update();
}, 100)


function onFrame(event) {
  //Zkontrolovat kolize
  Pohyb();
  presets.snimek += 1;
  Figurka.update();
}

var movement = {
  left: false,
  right: false,
  up: false,
  down: false,
  space: false,
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
  if (event.key == "space" && presets.cas && movement.up) {
    movement.space = true;
    presets.snimek = 0;
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
    Figurka.move(4);
  }
  if (movement.down) {
    Figurka.move(-4);
  }
  if (movement.space) {
    Figurka.dashdash(70);
  }
}

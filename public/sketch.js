var socket;
var canvas;
var redSlider, greenSlider, blueSlider;
var canvR = 0;
var canvB = 0;
var canvG = 0;
var bruR = 0;
var bruG = 0;
var bruB = 0;
var song;

function preload() {
  song = loadSound("/assets/moneymachine.mp3");
}

function setup() {
  song.play();

  console.log(socket);
  canvas = createCanvas(1000, 550);
  canvas.position(0, 0);
  background(0);
  //socket = io.connect('http://localhost:8080');
  //socket.on('mouse', newDrawing);*/
  var msr = 255;
  var msg = 0;
  var msb = 0;
  socket.on('mouse', function(data) {
    console.log("Got: " + data.x + " " + data.y);
    if (data.x < 1001 && data.y < 550) {
      fill(msr, msg, msb);
      noStroke();
      ellipse(data.x, data.y, 20, 20);
    }
    //if canvas color is being changed
    if (data.x > 1001 && data.y < 153) {
      background(data.cr, data.cg, data.cb);
    }
    //if brush color is being changed
    if (data.x > 1001 && data.y > 153 && data.y < 255) {
      msr = data.br;
      msg = data.bg;
      msb = data.bb;
    }
  });
  // canvas sliders
  redSlider = createSlider(0, 255, 0);
  redSlider.position(1100, 50);
  greenSlider = createSlider(0, 255, 0);
  greenSlider.position(1100, 80);
  blueSlider = createSlider(0, 255, 0);
  blueSlider.position(1100, 110);
  // brush colour sliders
  redBSlider = createSlider(0, 255, 255);
  redBSlider.position(1100, 170);
  greenBSlider = createSlider(0, 255, 0);
  greenBSlider.position(1100, 200);
  blueBSlider = createSlider(0, 255, 0);
  blueBSlider.position(1100, 230);
}

function draw() {

}

var brFill = 255;
var bgFill = 0;
var bbFill = 0;

function mouseDragged() {
  //if the user clicks inside the canvas
  if (mouseX < 1001 && mouseY < 550) {
    fill(brFill, bgFill, bbFill);
    noStroke();
    ellipse(mouseX, mouseY, 20, 20);
  }
  //if the canvas color is being changed
  if (mouseX > 1001 && mouseY < 153) {
    canvR = redSlider.value();
    canvG = greenSlider.value();
    canvB = blueSlider.value();
    background(canvR, canvG, canvB);
  }
  //if the brush color is being changed
  if (mouseX > 1001 && mouseY > 153 && mouseY < 255) {
    bruR = redBSlider.value();
    bruG = greenBSlider.value();
    bruB = blueBSlider.value();
    brFill = bruR;
    bgFill = bruG;
    bbFill = bruB;
  }
  //send the data
  sendmouse(mouseX, mouseY, canvR, canvG, canvB, bruR, bruG, bruB);
}

//sending data to the socket
function sendmouse(xpos, ypos, cr, cg, cb, br, bg, bb) {
  console.log("sendmouse: " + xpos + " " + ypos);

  var data = {
    x: xpos,
    y: ypos,
    cr: cr,
    cg: cg,
    cb: cb,
    br: br,
    bg: bg,
    bb: bb
  };

  //send data to the socket
  socket.emit('mouse', data);
}

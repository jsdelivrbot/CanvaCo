var socket;
var canvas;


function setup() {
  canvas = createCanvas(1000, 550);
  canvas.position(0, 0);
  background(25);
  socket = io.connect('http://localhost:' + process.env.PORT);
  //socket.on('mouse', newDrawing);*/

  socket.on('mouse', function(data) {
    console.log("Got: " + data.x + " " + data.y);
    fill(0, 0, 255);
    noStroke();
    ellipse(data.x, data.y, 20, 20);
    console.log(usernumber);
  });
}

function newDrawing(data) {
  noStroke();
  fill(255, 0, 100);
  ellipse(data.x, data.y, 10, 10);
}

function mouseDragged() {
  fill(255);
  noStroke();
  ellipse(mouseX, mouseY, 20, 20);
  //send the mouse coordinates
  sendmouse(mouseX, mouseY);
}

//sending data to the socket
function sendmouse(xpos, ypos) {
  console.log("sendmouse: " + xpos + " " + ypos);

  var data = {
    x: xpos,
    y: ypos
  };

  //send data to the socket
  socket.emit('mouse', data);
}

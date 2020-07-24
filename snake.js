var width = 520;
var height = width;

// create square block
var canvas = document.getElementById("myCanvas");

var context = canvas.getContext("2d");
context.fillStyle = "#808080";
context.fillRect(0, 0, width, height);

var state = 0; // 0->right direction, 1->down, 2-> left, 3->up

//key press handling function
function handleKey(e) {
    e = e || window.event;

    if (e.keyCode == '38' && state != 1 && state != 3) {
        //up arrow
        state = 3;
        play = true;
    }
    else if (e.keyCode == '40' && state != 1 && state != 3) {
        //down arrow
        state = 1;
        play = true;
    }
    else if (e.keyCode == '37' && state != 0 && state != 2) {
        //left arrow
        state = 2;
        play = true;
    }
    else if (e.keyCode == '39' && state != 0 && state != 2) {
        //right arrow
        state = 0;
        play = true;
    }

    if (play)
        playAudio();
}

document.onkeydown = handleKey;

//key press play audio
function playAudio() {
    var audio = new Audio('https://www.soundjay.com/switch/switch-1.wav');
    audio.play();
}

//consume food play audio
function consumeAudio() {
    var audio = new Audio('https://www.soundjay.com/misc/coins-in-hand-3.wav');
    audio.play();
}

var N = 20;
var cellSize = width / N;
//20 rows
var matrix = new Array(N);
for (var i = 0; i < matrix.length; i++) {
    matrix[i] = new Array(N);
}

//fill color in small cells
function drawSquare(i, j) {
    if ((i + j) % 2 == 0) {
        context.fillStyle = "#D3D3D3";
    } else {
        context.fillStyle = "#808080";
    }
    //context.fillRect(x, y, width, height)
    context.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
}

for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < matrix[i].length; j++) {
        matrix[i][j] = 0;
        drawSquare(i, j);
    }
}

var body = [];
//snake body cordinate in starting
body.push([1 + N / 2, N / 2]);
body.push([N / 2, N / 2]);
body.push([-1 + N / 2, N / 2]);

var eyeImage = new Image();
eyeImage.src = 'https://i.imgur.com/6jLbz7l.png';

var foodImage = new Image();
foodImage.src = "https://i.imgur.com/88saChB.png";




//snake position get and update canvas
var counter = 0;
var foodX = 0;
var foodY = 0;

function genrateFood() {
    var success = false;
    while (!success) {
        foodX = parseInt(Math.random() * N);
        foodY = parseInt(Math.random() * N);

        success = true;
        //food not collide with snake body
        for (var i = 0; i < body.length; i++) {
            if (body[i][0] == foodX && body[i][1] == foodY) {
                success = false;
            }
        }
    }
}

genrateFood();

function update() {
    counter++;

    var increase = false;
    if (body[0][0] == foodX && body[0][1] == foodY) {
        genrateFood();
        consumeAudio();
        increase = true;
    }

    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            drawSquare(i, j);
        }
    }

    //every time draw food image
    context.drawImage(foodImage,
        foodX * cellSize, foodY * cellSize,
        cellSize, cellSize);

    //draw snake with color
    for (var i = 0; i < body.length; i++) {
        context.fillStyle = ("#527DF9");
        context.fillRect(cellSize * body[i][0], cellSize * body[i][1], cellSize, cellSize);

        if (i == 0) {
            var marginX = cellSize / 3;
            var marginY = cellSize / 3;

            //right or left direction
            if (state == 0 || state == 2) {
                marginX = 0;
            } else if (state == 1 || state == 3) {
                marginY = 0;
            }

            context.drawImage(eyeImage,
                0, 28 * (counter % 9),
                cellSize, cellSize,
                cellSize * body[i][0] + marginX,
                cellSize * body[i][1] + marginY,
                cellSize, cellSize);
            context.drawImage(eyeImage,
                0, 28 * (counter % 9),
                cellSize, cellSize,
                cellSize * body[i][0] - marginX,
                cellSize * body[i][1] - marginY,
                cellSize, cellSize);
        }
    }

    // 0->right, 1->down, 2- left, 3 is up;
    var x = 0;
    var y = 0;
    if (state == 0) {
        x++;
    }
    else if (state == 1) {
        y++;
    }
    else if (state == 2) {
        x--;
    }
    else if (state == 3) {
        y--;
    }

    var first = body[0];
    var arr = [first[0] + x, first[1] + y];
    //insert at 0 index or add one more body part
    body.splice(0, 0, arr);

    if (!increase)
        body.pop();
}

setInterval(update, 300);

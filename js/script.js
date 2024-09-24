// Fonction pour sauvegarder les couleurs dans le localStorage
function saveColors() {
    localStorage.setItem('backgroundColor', document.getElementById("couleurback").value);
    localStorage.setItem('elementColor', document.getElementById("couleurtitre").value);
}

// Fonction pour restaurer les couleurs à partir du localStorage
function loadColors() {
    var backgroundColor = localStorage.getItem('backgroundColor');
    var elementColor = localStorage.getItem('elementColor');

    if (backgroundColor) {
        document.getElementById("couleurback").value = backgroundColor;
        document.body.style.backgroundColor = backgroundColor;
    }
    if (elementColor) {
        document.getElementById("couleurtitre").value = elementColor;
        var elements = document.querySelectorAll(".colorElement");
        elements.forEach(function(element) {
            element.style.color = elementColor;
        });
        ballColor = elementColor;
    }
}

// Appeler la fonction de chargement des couleurs au chargement de la page
window.onload = loadColors;

// Fonction pour changer la couleur de fond
document.getElementById("couleurback").addEventListener("input", function() {
    document.body.style.backgroundColor = this.value;
    saveColors(); // Sauvegarder les couleurs chaque fois qu'elles sont changées
});

// Fonction pour changer la couleur des éléments
document.getElementById("couleurtitre").addEventListener("input", function() {
    var elements = document.querySelectorAll(".colorElement");
    elements.forEach(function(element) {
        element.style.color = this.value;
    }, this);
    ballColor = this.value;
    saveColors(); // Sauvegarder les couleurs chaque fois qu'elles sont changées
});

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 1.25;
var dy = -1.25;
var ballRadius = 5;
var ballColor = document.getElementById("couleurtitre").value;
var paddleHeight = 5;
var paddleWidth = 200;
var paddleX = (canvas.width - paddleWidth) / 2;
var brickRowCount = 17; // 5 Briques par ligne
var brickColumnCount = 5; // 3 Briques par colonne
var brickWidth = 40; // Largeur d'une Brique
var brickHeight = 10; // Hauteur d'une Brique
var brickPadding = 10; // Ecart entre les Briques
var brickOffsetTop = 30; // Décalage supérieur
var brickOffsetLeft = 30; // Décalage à gauche
var score = 0; // Initialisation du score à 0
var lives = 5; // Initialisation des vies à 3
var ballSpeed = Math.round(Math.sqrt(dx * dx + dy * dy) * 100) / 100; // Calcul de la vitesse initiale de la balle arrondie au centième

// Initialisation des briques
var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Dessin de la balle
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

// Dessin de la palette
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#CD472C";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = ballColor;
    ctx.fillText("Score: " + score, 8, 20);
}
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = ballColor;
    ctx.fillText("Lives: " + lives, 800, 20);
}
function drawSpeed() {
    ctx.font = "16px Arial";
    ctx.fillStyle = ballColor;
    ctx.fillText("Speed: " + ballSpeed, 120, 20);
}
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

var rightPressed = false;
var leftPressed = false;

// Fonction d'actualisation de la balle et de la palette et des briques
function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetection();
    drawScore();
    drawLives();
    drawSpeed();
    
    requestAnimationFrame(draw);

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 8;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 8;
    }
    x += dx;
    y += dy;

    function collisionDetection() {
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                var b = bricks[c][r];
                if (b.status == 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        // Augmenter légèrement la vitesse après chaque collision avec une brique
                        ballSpeed = Math.round((ballSpeed * 1.02) * 100) / 100;
                        dx = Math.round((ballSpeed * dx / Math.abs(dx)) * 100) / 100;
                        dy = Math.round((ballSpeed * dy / Math.abs(dy)) * 100) / 100;
                    }
                }
            }
        }
        if (score == brickRowCount * brickColumnCount) {
            alert("Félicitations, vous avez gagné !");
            document.location.reload();
            clearInterval(interval);
        }
    }

    // Cas des rebonds
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            var distFromCenter = (x - (paddleX + paddleWidth / 2));
            var paddleCenter = paddleWidth / 2;
            var normalizedDist = distFromCenter / paddleCenter;
            var maxAngle = Math.PI / 3; // 60 degrees
            var angle = normalizedDist * maxAngle;
            dx = Math.round((ballSpeed * Math.sin(angle)) * 100) / 100;
            dy = Math.round((-ballSpeed * Math.cos(angle)) * 100) / 100;
        } else {
            lives = lives - 1;
            if (lives == 0) {
                alert("GAME OVER");
                document.location.reload();
                clearInterval(interval);
            }
        }
    }
    if (y + dy > canvas.height - ballRadius) {dy = -dy;
    }
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
}

document.getElementById("monbouton").addEventListener("click", function(){ 
    draw();
});
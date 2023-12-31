const ball = document.querySelector( '.ball' );
const paddleLeft = document.querySelector( '.paddle-left' );
const paddleRight = document.querySelector( '.paddle-right' );
const gameBoard = document.querySelector( '.game-board' );
const leftScore = document.querySelector( '#left-score' );
const rightScore = document.querySelector( '#right-score' );
const playPauseBtn = document.querySelector( '#play-pause-btn' );

let scoreLeft = 0;
let scoreRight = 0;
let ballX = 300;
let ballY = 200;
let ballSpeedX = 5;
let ballSpeedY = 5;
let count = 0, time = 0;
let play = -1;

function moveBall () {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if ( ballX + ball.clientWidth > gameBoard.clientWidth || ballX - ball.clientWidth < -5 ) {
        ballSpeedX = -ballSpeedX;
    }

    if ( ballY + ball.clientHeight > gameBoard.clientHeight || ballY - ball.clientHeight < -5 ) {
        ballSpeedY = -ballSpeedY;
    }

    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
}

let paddleLeftY = 150;
let paddleRightY = 150;
paddleLeft.style.top = paddleLeftY + 'px';
paddleRight.style.top = paddleRightY + 'px';

function movePaddles () {

    if ( !( paddleRightY + paddleRight.clientHeight > gameBoard.clientHeight || paddleRightY < 0 ) ) {

    }

    paddleLeft.style.top = paddleLeftY + 'px';
    paddleRight.style.top = paddleRightY + 'px';
}

document.addEventListener( 'keydown', async ( event ) => {
    if ( event.code === 'ArrowUp' ) {
        if ( !( paddleRightY < paddleRight.clientWidth ) ) {
            paddleRightY -= 20;
            paddleRight.style.boxShadow = '2px 10px 10px 0px lightgrey';
        }
    } else if ( event.code === 'ArrowDown' ) {
        if ( !( paddleRightY + paddleRight.clientHeight > gameBoard.clientHeight - paddleRight.clientWidth ) ) {
            paddleRightY += 20;
            paddleRight.style.boxShadow = '2px -10px 10px 0px lightgrey';
        }
    }
} );

document.addEventListener( 'keydown', async ( event ) => {
    if ( event.code === 'KeyW' ) {
        if ( !( paddleLeftY < paddleLeft.clientWidth ) ) {
            paddleLeftY -= 20;
            paddleLeft.style.boxShadow = '2px 10px 10px 0px lightgrey';
        }
    } else if ( event.code === 'KeyS' ) {
        if ( !( paddleLeftY + paddleLeft.clientHeight > gameBoard.clientHeight - paddleLeft.clientWidth ) ) {
            paddleLeftY += 20;
            paddleLeft.style.boxShadow = '2px -10px 10px 0px lightgrey';
        }
    }
} );

// monitor on keup
document.addEventListener( 'keyup', ( event ) => {
    if ( event.code === 'ArrowUp' || event.code === 'ArrowDown' ) {
        paddleRight.style.boxShadow = 'none';
    } else if ( event.code === 'KeyW' || event.code === 'KeyS' ) {
        paddleLeft.style.boxShadow = 'none';
    }
} );

function detectCollision () {
    if ( ballX + ball.clientWidth > paddleRight.offsetLeft &&
        ballY + ball.clientHeight > paddleRight.offsetTop &&
        ballY < paddleRight.offsetTop + paddleRight.clientHeight ) {
        ballSpeedX *= -1;
    }

    if ( ballX < paddleLeft.offsetLeft + paddleLeft.clientWidth &&
        ballY + ball.clientHeight > paddleLeft.offsetTop &&
        ballY < paddleLeft.offsetTop + paddleLeft.clientHeight ) {
        ballSpeedX *= -1;
    }
}

async function gameLoop () {

    const promise = new Promise( ( resolve, reject ) => {
        movePaddles();
        moveBall();
        resolve();
    } );

    await promise;
    monitorSpeed();





    updateScore();
    detectCollision();
    checkBallOffCanvas();

    if ( play == 1 ) {
        requestAnimationFrame( gameLoop );
    }
}

// wait for script to fully load
window.onload = () => {
    gameLoop();
};


// monitor scores
function updateScore () {
    if ( ballX + ball.clientWidth > gameBoard.clientWidth ) {
        scoreLeft++;
    } else if ( ballX - ball.clientWidth < -5 ) {
        scoreRight++;
    }

    leftScore.textContent = scoreLeft;
    rightScore.textContent = scoreRight;
}

// monitor error of ball being off the canvas
function checkBallOffCanvas () {
    if ( ballX + ball.clientWidth > ( gameBoard.clientWidth + 5 ) || ballX - ball.clientWidth < ( -5 - 5 ) ) {
        ballX = 150;
    }

    if ( ballY + ball.clientHeight > gameBoard.clientHeight + 5 || ballY - ball.clientHeight < ( -5 - 5 ) ) {
        ballY = 150;
    }
}

// monitor time and increase speed
function monitorSpeed () {
    count += 1;

    if ( count % 100 === 0 ) {
        time++;
    }

    if ( time % 500 == 0 && time != 0 ) {
        ballSpeedX += 1;
        ballSpeedY += 1;
        console.log( 'speed increased: ', time );
    }
}

// reset game
const resetBtn = document.querySelector( '#reset-btn' );
resetBtn.onclick = function reset () {
    scoreLeft = 0;
    scoreRight = 0;
    ballX = 300;
    ballY = 200;
    ballSpeedX = 5;
    ballSpeedY = 5;
    count = 0;
    time = 0;
    play = -1;
    playPauseBtn.textContent = 'Play';
    gameLoop();
};

// play pause
playPauseBtn.onclick = function playPause () {
    play *= -1;
    gameLoop();

    if ( playPauseBtn.textContent === 'Play' ) {
        playPauseBtn.textContent = 'Pause';
    } else {
        playPauseBtn.textContent = 'Play';

    }


}


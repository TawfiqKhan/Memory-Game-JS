// List of symobls which represent all the cards in the game
let icons = ["diamond", "bullhorn", "anchor", "bolt", "cube", "anchor", "leaf", "bicycle", "diamond", "bomb", "leaf", "bomb", "bolt", "bicycle", "cube", "bullhorn"];


// Some variables are set  for efficiency and for use as counter

const $board = $('.deck');
let $totalMoves = $('.moves');
const $restart = $('.reset');
const $start = $('.start');
const $counter = $('.counter');

let $rating = $('.score-panel').find('i');
let totalCard = icons.length / 2;
let match = 0;
let moves = 0;
let timer;
// this is the fucntion to shuffle the cards each time the game is reset.

function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// this is the start Game Funtion. Each symbols are added to the HTML to form the visual Game Board.

let totalSeconds = 0;

function countUp() {
    let timerVar = setInterval(countTimer, 1000);

    function countTimer() {
        ++totalSeconds;
        let hour = Math.floor(totalSeconds / 3600);
        let minute = Math.floor((totalSeconds - hour * 3600) / 60);
        let seconds = totalSeconds - (hour * 3600 + minute * 60);
        $counter.html("Timer " + hour + ":" + minute + ":" + seconds);
    }
}



// function counterStop () {
//     return countUp;
// }

function gameStart() {
    let cards = shuffle(icons);
    $board.empty();
    moves = 0;
    match = 0;
    $totalMoves.html(moves);
    $rating.removeClass('fa-star-o').addClass('fa-star');
    for (let i = 0; i < cards.length; i++) {
        $board.append($('<li class="card "><i class="fa fa-' + cards[i] + '"></i></li>'));
    }
    countUp();
}

// This is the function that is used to provide the ginal rating which takes the no of moves or clicks a player made during the game as parameter.

function gameRating(moves) {

    let rating5 = totalCard + 7;
    let rating4 = totalCard + 12;
    let rating3 = totalCard + 17;
    let rating2 = totalCard + 23;

    if (moves > rating5 && moves < rating4) {
        $rating.eq(4).removeClass('fa-star').addClass('fa-star-o');
        rating = 4;

    } else if (moves > rating4 && moves < rating3) {
        $rating.eq(3).removeClass('fa-star').addClass('fa-star-o');
        rating = 3;

    } else if (moves > rating3 && moves < rating2) {
        $rating.eq(2).removeClass('fa-star').addClass('fa-star-o');
        rating = 2;

    } else if (moves > rating2) {
        $rating.eq(1).removeClass('fa-star').addClass('fa-star-o');
        rating = 1;

    }
    return {
        score: rating
    };
}

// the function that pops us at the end of the game congratulating the player and showing their score.



function endGame(moves, score) {
    swal({
            title: "Congratulatios!",
            text: "You have matched all the Cards and took  only " + moves + " clicks and manged to earn " + score + " Star!!" + "with the following " + timer,
            imageUrl: "img/thumbs.jpg",
            type: 'success',
            confirmButtonColor: '#33cc33',
            confirmButtonText: 'Play again!'
        },
        function(isConfirm) {
            if (isConfirm) {
                gameStart();
                window.location.reload();
            }
        });
}


// This is  the main game logic. First the click even is listened and based on that come specific classes are added to the html which  in turn shows or hides the card.
//First click or open card is matched with the second card by storing their values in a variable and if matches they are
//saved in a different variable which can be called to  determine the end of the game



let card1, card2, card1icon, card2icon;
$board.on("click", ".card:not('.match, .open')", function() {
    if ($('.show').length > 1) {
        return true;
    }

    // Cards are opened after click
    $(this).addClass('open show');
    moves++;
    $totalMoves.html(moves);
    if (card1) {
        card2 = $(this);
        card2icon = $(this.children).attr("class");
        if (card1icon === card2icon) {
            $(card1).removeClass("open show").addClass("match animated  tada");
            $(card2).removeClass("open show").addClass("match animated  tada");

            card1 = card2 = card1icon = card2icon = null;
            match++;

        } else

            $(card1).addClass('nomatch animated  shake');
        $(card2).addClass('nomatch animated shake');
        setTimeout(function() {
            card1icon = card2icon = null;
            $(card1).removeClass('open show shake nomatch');
            $(card2).removeClass('open show shake nomatch');
            card1 = card2 = null;
        }, 600);
    } else {
        card1 = $(this);
        card1icon = $(this.children).attr("class");
    }

    gameRating(moves);
    // checks for the end game condition.

    if (totalCard === match) {

        gameRating(moves);

        let score = gameRating(moves).score;
        timer = $counter.html();
        $counter.remove();
        endGame(moves, score, timer);
    }

});

// restart function for the restart button

function restart() {

    swal({
            title: "Are you sure you want to reset",
            text: "All your progress will be lost!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Reset Please!",
            closeOnConfirm: false
        },
        function() {
            swal("Reset", "The Game has been Reset!.", "success");
            gameStart();
            window.location.reload();
        });
}


$restart.on('click', restart);

$start.on('click', gameStart);
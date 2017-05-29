function generateWinningNumber(){
    return Math.round(Math.random() * (99)) + 1;
}

function shuffle(array) {
  var m = array.length, t, i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function Game(){
    this.playersGuess = null
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber.call();
}

function newGame(){
    return new Game();
}

Game.prototype.difference = function (){
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function(){
    return(this.playersGuess < this.winningNumber);
}

Game.prototype.playersGuessSubmission = function(num){
    if (num < 1 || num > 100 || isNaN(num)) {
        var err = "That is an invalid guess.";
        alert(err);
        throw err;
    }
    this.playersGuess = num;
    this.checkGuess();
}

Game.prototype.checkGuess = function(){
    return checkGuess.call(this,this.playersGuess);
}

function checkGuess(){
    if (this.pastGuesses.includes(this.playersGuess)){
        $('#subtitle').text('You have already guessed that number.');
    } else if (this.playersGuess === this.winningNumber){
        endGame(this,'You Win!');
    } else {
        this.pastGuesses.push(this.playersGuess);
        $('.guess:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);

        if (this.pastGuesses.length >= 5){
            endGame(this,"You Lose.");
        } else  if (this.difference() < 10){
            continueGame(this, "You're burning up!");
        } else if (this.difference() < 25) {
            continueGame(this, "You're lukewarm.");
        } else if (this.difference() < 50) {
            continueGame(this, "You're a bit chilly.");
        } else {
            continueGame(this, "You're ice cold!");
        }
    }
}

Game.prototype.provideHint = function(){
    var hintarr =[this.winningNumber, generateWinningNumber(), generateWinningNumber()];
    return shuffle(hintarr);
}

$(document).ready(function(e) { 
    var game = newGame();

    $('#go').on('click', function(){
         makeAGuess(game);
    });

    $('#player-input').keypress(function(event) {
        if (event.which == 13) {
           makeAGuess(game);
        }
    })

    $('#reset').on('click', function(){
      game = newGame();
      $('#player-input').val('');
      $('#hint, #go').prop("disabled",false);
      $('.guess').text('-');
      $('#title').text('Play the Guessing Game');
      $('#subtitle').text('Guess a number between 1-100!');
    });

    $('#hint').on('click', function(){
        var hints = game.provideHint();
        $('#subtitle').text('The Winning Number is ' + 
          hints[0] + ' or ' + hints[1] + ' or ' + hints[2] );
    });
});

function makeAGuess(game){
    var guess = +$('#player-input').val();
    $('#player-input').val('');
    game.playersGuessSubmission(guess);
}
    
function continueGame(game,res){
    var subtitle = game.isLower() ? 'Guess Higher!' : 'Guess Lower!';
    $('#title').text(res);
    $('#subtitle').text(subtitle);
}

function endGame(game,res){
    $('#player-input').val(game.winningNumber);
    $('#hint, #go').prop("disabled",true);
    $('#title').text(res);
    $('#subtitle').text('Press Reset to Play Again');
}
     
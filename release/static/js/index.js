/*****************************************************************************************************
*****************************************************************************************************
init
*****************************************************************************************************
*****************************************************************************************************/

var combo = [
  [ 0, 1, 2 ], // rows
  [ 3, 4, 5 ],
  [ 6, 7, 8 ],
  [ 0, 3, 6 ], // columns
  [ 1, 4, 7 ],
  [ 2, 5, 8 ],
  [ 0, 4, 8 ], // diagonal
  [ 6, 4, 2 ]
];
var board = [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
var players = {
  1: {
    "type": "human",
    "key": "<img class=\"animated bounceIn\" src=\"static/img/x.svg\">",
    "score": 0
  },
  2: {
    "type": "computer",
    "key": "<img class=\"animated bounceIn\" src=\"static/img/o.svg\">",
    "score": 0
  }
};
var turn = 1;
var outcome = 0;


/*****************************************************************************************************
*****************************************************************************************************
UI
*****************************************************************************************************
*****************************************************************************************************/

$.fn.extend( {
  showElement: function() {
    var element = this;
    $( element ).removeClass( "dead" );
    $( element ).removeClass( "hidden" );
  },
  hideElement: function() {
    var element = this;
    $( element ).addClass( "hidden" );
    setTimeout( function() {
      $( element ).addClass( "dead" );
    }, 800 );
  }
} );

function setView( view ) {
  switch ( view ) {
    case "select":
      $( "#status #message" ).html( "Select Players" )
      $( "#game #intro, #dash #select" ).showElement();
      $( "#game #board, #dash #score, #status #back, #status #reset" ).hideElement();
      break;
    case "game":
      $( "#game #intro, #dash #select" ).hideElement();
      $( "#game #board, #dash #score, #status #back, #status #reset" ).showElement();
      break;
  }
}

function setMessage( str ) {
  $( "#status #message" ).html( str );
}

function placeKey( space, turn ) {
  if ( turn ) {
    $( "#game #board #" + space ).html( players[ turn ][ "key" ] );
  } else {
    $( "#game #board #" + space ).html( "" );
  }
}

function setScore( turn ) {
  $( "#dash #score #p" + turn + " .score" ).html( ( "0" + players[ turn ][ "score" ] ).slice( -2 ) );
}


/*****************************************************************************************************
*****************************************************************************************************
Game
*****************************************************************************************************
*****************************************************************************************************/

$( document ).ready( function() {

  setView( "select" );

  // Button Events ************************************************************

  $( "#dash #select .dash-box .button" ).click( function() { // player type selector
    var data = this.id.split( "-" );
    data[ 0 ] = parseInt( data[ 0 ].charAt( 1 ), 10 );
    switch ( data[ 1 ] ) {
      case "human":
        $( "#p" + data[ 0 ] + "-computer" ).removeClass( "is-active" );
        $( "#p" + data[ 0 ] + "-human" ).addClass( "is-active" );
        players[ data[ 0 ] ][ "type" ] = "human";
        break;
      case "computer":
        $( "#p" + data[ 0 ] + "-computer" ).addClass( "is-active" );
        $( "#p" + data[ 0 ] + "-human" ).removeClass( "is-active" );
        players[ data[ 0 ] ][ "type" ] = "computer";
        break;
    }
  } );

  $( "#status #back" ).click( function() {
    setView( "select" );
  } );

  $( "#dash #select #go" ).click( function() { // go / reset button
    resetScore();
    init();
  } );

  $( "#status #reset" ).click( function() { // go / reset button
    init();
  } );

  $( "#game #board .button" ).click( function() { // game space click
    if ( players[ turn ][ "type" ] === "human" && board[ parseInt(this.id,10) ] === 0) { // only lets you press if your turn is human
      action( this.id );
    }
  } );

  // Logic ************************************************************

  function resetScore() {
    players[ 1 ][ "score" ] = 0;
    players[ 2 ][ "score" ] = 0;
    setScore( 1 );
    setScore( 2 );
  }

  function init() { // set up game board
    board = [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
    outcome = 0;
    for ( var i in board ) {
      placeKey( i );
    }
    setView( "game" );
    turn = Math.round( Math.random() ) + 1;
    setMessage( "Player " + turn + "\'s Turn" );
    if ( players[ turn ][ "type" ] === "computer" ) { // call action if computer first
      action();
    }
  }

  function action( space ) { // called from init or button press
    if ( !outcome ) {
      setMessage( "Player " + turn + "\'s Turn" );
      if ( players[ turn ][ "type" ] === "human" ) {
        space = parseInt( space, 10 )
        board[ space ] = turn;
        placeKey( space, turn ); // mark game space
      } else {
        space = suggestMove()
        board[ space ] = turn;
        placeKey( space, turn );
      }
      outcome = evalOutcome( turn );
      if ( outcome === 1 ) {
        setMessage( "Player " + turn + " Wins!" );

      } else if ( outcome === 2 ) {
        setMessage( "Draw!" );
      }
      turn = ( turn === 1 ? 2 : 1 );
      if ( players[ turn ][ "type" ] === "computer" ) { // launch turn if computer
        action();
      }
    }
  }

  function suggestMove() {
    for ( var row in combo ) {
      var move = 0;
      var result1 = 0;
      var result2 = 0;
      for ( var rowidx in combo[ row ] ) {
        if ( board[ combo[ row ][ rowidx ] ] === 1 ) {
          result1++;
        } else if ( board[ combo[ row ][ rowidx ] ] === 2 ) {
          result2++;
        } else {
          move = combo[ row ][ rowidx ];
        }
      }
      if ( result1 === 2 || result2 === 2 ) {
        if ( board[ move ] === 0 ) {
          return move;
        }
      }
    }
    var remain = [];
    for ( var idx in board ) {
      if ( !board[ idx ] ) {
        remain.push( idx );
      }
    }
    var rand = Math.floor( Math.random() * remain.length );
    return remain[ rand ];
  }

  function evalOutcome( turn ) { // check for outcomes
    for ( var row in combo ) {
      var result = 0;
      for ( var rowidx in combo[ row ] ) {
        if ( board[ combo[ row ][ rowidx ] ] === turn ) {
          result++;
        }
      }
      if ( result === 3 ) {
        players[ turn ][ "score" ]++;
        setScore( turn );
        return 1;
      }
    }
    for ( var idx in board ) {
      if ( !board[ idx ] ) {
        return 0;
      }
    }
    return 2;
  };

} );

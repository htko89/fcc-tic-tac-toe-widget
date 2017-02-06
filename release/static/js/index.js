/*****************************************************************************************************
*****************************************************************************************************
init
*****************************************************************************************************
*****************************************************************************************************/

var combo = [
  // rows
  [ 0, 1, 2 ],
  [ 3, 4, 5 ],
  [ 6, 7, 8 ],
  // columns
  [ 0, 3, 6 ],
  [ 1, 4, 7 ],
  [ 2, 5, 8 ],
  // diag
  [ 0, 4, 8 ],
  [ 6, 4, 2 ]
];
var players = {
  "p1": {
    "type": "human"
  },
  "p2": {
    "type": "computer"
  }
};
var turn = "p1";
var debug = 0;

/*****************************************************************************************************
*****************************************************************************************************
Game Logic
*****************************************************************************************************
*****************************************************************************************************/

$( document ).ready( function() {

  setView( "select" );

  $( "#status #back" ).click( function() {
    setView( "select" );
  } );

  $( "#dash #select .dash-box .button" ).click( function() {
    var data = this.id.split( "-" );
    switch ( data[ 1 ] ) {
      case "human":
        $( "#" + data[ 0 ] + "-computer" ).removeClass( "is-active" );
        $( "#" + data[ 0 ] + "-human" ).addClass( "is-active" );
        players[ data[ 0 ] ][ "type" ] = "human";
        break;
      case "computer":
        $( "#" + data[ 0 ] + "-computer" ).addClass( "is-active" );
        $( "#" + data[ 0 ] + "-human" ).removeClass( "is-active" );
        players[ data[ 0 ] ][ "type" ] = "computer";
        break;
    }
  } );

  $( "#dash #select #go" ).click( function() {
    if ( Math.round( Math.random() ) ) {
      turn = "p2";
    }
    setView( "game" );
    turnAction();
  } );

  $( "#game #board .button" ).click( function() {
    if(players[turn]["type"] === "human"){ // only lets you press if your turn is human
      turnAction();
    }
  } );

  function turnAction(){
    setTurnMessage();
    console.log(turn,players);



    turn = ( turn === "p1" ? "p2" : "p1");
    if (players[turn]["type"] === "computer"){
      // debug++;
      // if ( debug < 10 ) {
      //   turnAction();
      // }
    }
  }



} );

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
      $( "#game #board, #dash #score, #status #back" ).hideElement();
      break;
    case "game":
      $( "#game #intro, #dash #select" ).hideElement();
      $( "#game #board, #dash #score, #status #back" ).showElement();
      break;
  }
}

function setTurnMessage() {
  $( "#status #message" ).html( ( turn === "p1" ? "Player 1's Turn" : "Player 2's Turn" ) );
}

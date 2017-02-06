$( document ).ready( function() {

  /*****************************************************************************************************
  *****************************************************************************************************
  init
  *****************************************************************************************************
  *****************************************************************************************************/

  var players = {
    "p1": {
      "type": "human"
    },
    "p2": {
      "type": "computer"
    }
  };
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
  var turn = "p1";


  /*****************************************************************************************************
  *****************************************************************************************************
  UI
  *****************************************************************************************************
  *****************************************************************************************************/

  setView( "select" );

  function setView( view ) {
    switch ( view ) {
      case "select":
        $( "#status #message" ).html( "Select Players" )
        $( "#game-board, #dash-score" ).addClass( "hidden" );
        $( "#game-intro, #dash-select" ).removeClass( "hidden" );
        break;
      case "game":
        setTurnMessage();
        $( "#game-intro, #dash-select" ).addClass( "hidden" );
        $( "#game-board, #dash-score" ).removeClass( "hidden" );
        break;
    }
    console.log( "test" );
  }

  function setTurnMessage() {
    $( "#status #message" ).html( ( turn === "p1" ? "Player 1's Turn" : "Player 2's Turn" ) );
  }

  /*****************************************************************************************************
  *****************************************************************************************************
  Game Logic
  *****************************************************************************************************
  *****************************************************************************************************/

  $( "#dash-select .dash-box .button" ).click( function() {
    var data = this.id.split( "-" );
    switch ( data[ 1 ] ) {
      case "human":
        $( this ).addClass( "is-active" );
        $( "#" + data[ 0 ] + "-computer" ).removeClass( "is-active" );
        players[ data[ 0 ] ][ "type" ] = "human";
        break;
      case "computer":
        $( this ).addClass( "is-active" );
        $( "#" + data[ 0 ] + "-human" ).removeClass( "is-active" );
        players[ data[ 0 ] ][ "type" ] = "computer";
        break;
    }
  } );

  $( "#dash-select #go" ).click( function() {
    console.log( players );
    if ( Math.round( Math.random() ) ) {
      turn = p2;
    }
    setView( "game" );
  } );

  $( "#game-board .button" ).click( function() {
    setView( "select" );
  } );


} ); // end doc ready

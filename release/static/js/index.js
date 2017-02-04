$( document ).ready( function() {

  // timer

  var pomoTimer = new timer();
  var multiplier = 60; // set 1 for seconds, 60 for minutes. Used to speed up debugging.
  var workTime = 0;
  var playTime = 0;
  var totalTime = 0;
  var btnState = "play";
  var timersElapsed = 0;
  var workSound = new Audio( "static/audio/Salacia.ogg" );
  var playSound = new Audio( "static/audio/Ariel.ogg" );

  $( "#progress" ).circleProgress( {
    size: 220,
    thickness: 2,
    startAngle: Math.PI / 4 * 6,
    lineCap: "round",
    value: 0,
    animation: {
      duration: 100
    },
    fill: {
      gradient: [
        [ "#f44336", .75 ],
        [ "#b71c1c", .25 ]
      ],
      gradientAngle: Math.PI / 4 * 2
    }
  } );

  $( "#btn-play" ).click( function() {
    if ( btnState === "play" ) {
      console.log( "btn play" );
      $( "#btn-play i" ).attr( "class", "fa fa-stop" );
      workTime = parseInt( $( "#input-work" ).val(), 10 );
      playTime = parseInt( $( "#input-play" ).val(), 10 );
      totalTime = workTime + playTime;
      if ( workTime !== 0 ) {
        pomoTimer.start( "work", workTime, inputUpdate, router );
      } else {
        if ( playTime !== 0 ) {
          pomoTimer.start( "play", playTime, inputUpdate, router );
        } else {
          $( "#display .input" ).addClass( "animated shake" );
        }
      }
      btnState = "stop";
    } else {
      console.log( "btn stop" );
      pomoTimer.stop( "all", router );
      btnState = "play";
    }
  } );

  function inputUpdate( name, time ) {
    // console.log( "timer update", name, time );
    var progTime = 0;
    if ( name === "work" ) {
      progTime = ( workTime - time ) / totalTime;
    } else {
      progTime = ( ( playTime - time ) + workTime ) / totalTime;
    }
    $( "#progress" ).circleProgress( "value", progTime );
    $( "#input-" + name ).val( ( "0" + Math.round( time ) ).slice( -2 ) );
  }

  function router( name, timer ) {
    console.log( "timer stop", name )
    if ( name === "work" ) {
      $( "#input-work" ).val( "00" );
      pomoTimer.start( "play", playTime, inputUpdate, router );
    } else if ( name === "play" ) {
      if (timersElapsed >= 12){
        $( "#counter" ).html("");
        timersElapsed = 0;
      }
      $( "#input-work" ).val( ( "0" + workTime ).slice( -2 ) );
      $( "#input-play" ).val( ( "0" + playTime ).slice( -2 ) );
      $( "#progress" ).circleProgress( "value", 0 );
      $( "#counter" ).append( "<img class=\"tomato\" src=\"static/img/tomato.png\">" );
      pomoTimer.start( "work", workTime, inputUpdate, router );
      timersElapsed++;
    } else {
      $( "#btn-play i" ).attr( "class", "fa fa-play" );
      $( "#input-work" ).val( ( "0" + workTime ).slice( -2 ) );
      $( "#input-play" ).val( ( "0" + playTime ).slice( -2 ) );
      $( "#progress" ).circleProgress( "value", 0 );
      $( "#counter" ).html("");
      btnState = "play";
      timersElapsed = 0;
    }
  }

  function timer() {
    var time = 0;
    var timeStart = 0;
    var started = false;
    var timer_id;
    this.start = function( name, time, cbUpdate, cbStop ) {
      if ( !started ) {
        if ( name === "work" ) {
          workSound.play();
        } else {
          playSound.play();
        }
        time *= 1000 * multiplier;
        timeStart = new Date().getTime();
        started = true;
        timer_id = setInterval( function() {
          var timeLeft = time - ( new Date().getTime() - timeStart );
          if ( timeLeft <= 0 ) {
            started = false;
            clearInterval( timer_id );
            cbStop( name );
          } else {
            cbUpdate( name, timeLeft / 1000 / multiplier )
          };
        }, 100 ); // the smaller this number, the more accurate the timer will be}
      }
    }
    this.stop = function( name, cbStop ) {
      if ( started ) {
        started = false;
        clearInterval( timer_id );
        cbStop( name );
      }
    }
  }

} ); // end doc ready

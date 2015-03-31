/*
 * intern wird in mm gerechnet, alle Anzeigen werden entsprechend konvertiert 
 */

var a = 0.0,
    a1 = 0.0,
    a2 = 0.0,
    r1 = 0.0,
    r2 = 0.0,
    Lg = 0.0,
    L1 = 0.0,
    L2 = 0.0,
    abschnittslaenge = 0.0;
    

/*
 * jQueryUI functions
 */

$(function() {
  $( "#rechnen" )
    .button()
    .click(function() {
    rechnen();});
   $( "#ermitteln" )
    .button()
    .click(function() {
    ermitteln();});   
   $( "#tabs" )
    .tabs( {heightStyle: "auto"} );
    });

function ermitteln() {

  r1 = parseFloat( $( "#r1" ).val() );
  r2 = parseFloat( $( "#r2" ).val() );
  Lg = parseFloat( $( "#Lg" ).val() * 1000.0 );
  abschnittslaenge = parseFloat( $( "#abschnittslaenge" ).val() );
  grenzenErrechnen();
  var erlaubteDifferenz = Lg / 1000000.0,
      maxZaehler = 0;
   
  while ((Math.abs(Lg - L1) > erlaubteDifferenz ) && (maxZaehler < 100) ) {
    maxZaehler = maxZaehler + 1;
    naechsteIteration();
  }
  a = (a1 + a2) / 2.0;
  var schichtdicke = a * 2.0 * Math.PI * 1000.0;
  $( "#schichtdicke" ).val( schichtdicke );
  $( "#rechnen" ).show( "puff", 500 );
}

function grenzenErrechnen() {

    a1 = r1 * ( r2 - r1 ) / Lg;
    a2 = r2 * ( r2 - r1 ) / Lg;
    
    L1 = laengeBerechnen(r1, r2, a1);
    L2 = laengeBerechnen(r1, r2, a2);
}

function laengeBerechnen(r1, r2, a) {

  var laenge = 0.0;
  
  var phi1 = r1 / a,
      wurzelausdruck1 = Math.sqrt( phi1 * phi1 + 1 ),
      laenge1 = phi1 * wurzelausdruck1 + Math.log( phi1 + wurzelausdruck1 );
  laenge1 = laenge1 * a / 2.0;
  
  var phi2 = r2 / a,
      wurzelausdruck2 = Math.sqrt( phi2 * phi2 + 1 ),
      laenge2 = phi2 * wurzelausdruck2 + Math.log( phi2 + wurzelausdruck2 );
  laenge2 = laenge2 * a / 2.0;            
      
  laenge = laenge2 - laenge1;
  
  return laenge;
}

function naechsteIteration() {

   var  aT = (a1 + a2) / 2.0;
       
   var neueLaenge = laengeBerechnen(r1, r2, aT);

   if (neueLaenge < Lg ) {
   
     a2 = aT;
     L2 = neueLaenge;
     
  } else {
    
     a1 = aT;
     L1 = neueLaenge;   
   }
}

function rechnen() {
  var rd = parseFloat( $( "#rd" ).val() ),
      restabschnitte = 0.0;
  
  var laenge_innen = berechneLaengeAusRadius( r1 ),
      laenge_aussen = berechneLaengeAusRadius( r1 + rd );
      
  var restrollenlaenge = laenge_aussen - laenge_innen,
      abschnittslaenge = parseFloat( $( "#abschnittslaenge" ).val() );
      
      if (abschnittslaenge > 0 ) {
        restabschnitte = restrollenlaenge / abschnittslaenge;
      } else {
	restabschnitte = 0;
      }

  $( "#La" ).val( restrollenlaenge / 1000 );
  $( "#LaA" ).val( Math.round(restabschnitte) );
}


function berechneLaengeAusRadius(radius) {
  var phi = radius / a,
      wurzelausdruck = Math.sqrt( phi * phi + 1 ),
      laenge = phi * wurzelausdruck + Math.log( phi + wurzelausdruck );
  laenge = laenge * a / 2.0;
  return laenge;
}

function init() {
    $( "#schichtdicke" ).val( 500 );
    $( "#r1" ).val( 21.0 );
    $( "#r2" ).val( 16.0 );
    $( "#rd" ).val( 16.0 );
    $( "#La" ).val( 0.0 );
    $( "#Lg" ).val( 33.750 );
    $( "#abschnittslaenge" ).val( 135.0 );
    $( "#rechnen" ).hide( "puff" );
}

window.onload = init;








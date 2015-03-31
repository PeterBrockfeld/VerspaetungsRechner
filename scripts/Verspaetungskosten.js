/*jslint browser: true*/
/*globals $, jQuery, alert*/
/*
 * Verspätungskosten-Berechnung
 * Peter Brockfeld, 2015-03-31
 */


var anzahlEingeladene = 0,
    startZeit = new Date(),
    titel = '',
    durchschnittsKosten = 0.0,
    ankunftsZeiten = [],
    anzahlAnwesende = 0,
    bisherigeKosten = 0.0;

function einerMehr() {
    "use strict";
    anzahlAnwesende = anzahlAnwesende + 1;
    $("#anzahlAnwesende").html(anzahlAnwesende);
}

/*
 * jQueryUI functions
 */

$(function () {
    "use strict";
    $("#einerMehr")
        .button()
        .click(function () {
            einerMehr();
        });
    $("#tabs")
        .tabs({
            heightStyle: "auto"
        });
    $("#sliderDKosten")
        .slider();
    $("#sliderGeladene")
        .slider();
});

function init() {
    "use strict";
    $("#titel").html("Test");
    $("#anzahlAnwesende").html(anzahlAnwesende);
    $("#anzahlEingeladene").val(0);
    $("#bisherigeKosten").val(0.0);
}

window.onload = init;
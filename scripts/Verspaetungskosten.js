/*jslint browser: true*/
/*globals $, jQuery, alert*/
/*
 * Verspätungskosten-Berechnung
 * Peter Brockfeld, 2015-03-31
 */


var anzahlEingeladene = 0,
    startZeit = {},
    titel = '',
    durchschnittsKosten = 0.0,
    ankunftsZeiten = [],
    anzahlAnwesende = 0,
    letzteGesamtKosten = 0.0;

function parseTime(timeString) {
    "use strict";
    if (timeString === '') {
        return null;
    }

    var time = timeString.match(/(\d+)(:(\d\d))?\s*(p?)/i),
        hours = 0,
        d = {};

    if (time === null) {
        return null;
    }

    hours = parseInt(time[1], 10);
    if (hours === 12 && !time[4]) {
        hours = 0;
    } else {
        hours += (hours < 12 && time[4]) ? 12 : 0;
    }
    d = new Date();
    d.setHours(hours);
    d.setMinutes(parseInt(time[3], 10) || 0);
    d.setSeconds(0, 0);
    return d;
}

function kostenNeuErrechnen() {
    "use strict";
    var gesamtKosten = 0.0,
        jetzt = new Date();

    function kostenHinzuAddieren(element, index, array) {
        var diff = element - startZeit,
            zeitInVeranstaltung = 0.0;
        if (diff > 0.0) {
            zeitInVeranstaltung = jetzt - element;
        } else {
            zeitInVeranstaltung = jetzt - startZeit;
        }
        gesamtKosten = gesamtKosten + durchschnittsKosten * zeitInVeranstaltung / (3600000);

    }

    if ((anzahlAnwesende < anzahlEingeladene) && (jetzt >= startZeit)) {
        ankunftsZeiten.forEach(kostenHinzuAddieren);
        letzteGesamtKosten = gesamtKosten;
    } else {
        gesamtKosten = letzteGesamtKosten;
    }

    $("#bisherigeKosten").html(gesamtKosten.toLocaleString('de-DE', {
        style: 'currency',
        currency: 'EUR'
    }));
    setTimeout(kostenNeuErrechnen, 2000);
}

function einerMehr() {
    "use strict";
    anzahlAnwesende = anzahlAnwesende + 1;
    ankunftsZeiten.push(new Date());
    $("#anzahlAnwesende").html(anzahlAnwesende);
}

function einstellungenUebernehmen() {
    "use strict";
    titel = $("#inputTitle").val();
    $("#titel").html(titel);
    startZeit = parseTime($("#inputStarttime").val());
    $("#geplanterStart").html(startZeit.toLocaleTimeString());
    durchschnittsKosten = parseFloat($("#sliderDKosten").slider("value"));
    anzahlEingeladene = parseInt($("#sliderGeladene").slider("value"), 10);
    $("#anzahlEingeladene").html(anzahlEingeladene.toString());
    einerMehr();  //jemand muss den Knopf betätigt haben :-)
    kostenNeuErrechnen();
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
    $("#uebernehmen")
        .button()
        .click(function () {
            einstellungenUebernehmen();
        });
    $("#tabs")
        .tabs({
            heightStyle: "auto"
        });
    $("#sliderDKosten")
        .slider({
            slide: function (event, ui) {
                $("#auswahlDurchschnittskosten").html(ui.value);
            },
            min: 9.0,
            max: 125.0,
            step: 1.0,
            value: 9.0
        });

    $("#sliderGeladene")
        .slider({
            slide: function (event, ui) {
                $("#auswahlEingeladene").html(ui.value);
            },
            min: 2,
            max: 20,
            step: 1,
            value: 2
        });
});

function init() {
    "use strict";
    $("#titel").html("Test");
    $("#anzahlAnwesende").html(anzahlAnwesende);
    $("#anzahlEingeladene").val(0);
    $("#bisherigeKosten").val(0.0);
    $("#auswahlDurchschnittskosten").html("9");
    $("#auswahlEingeladene").html("2");
}

window.onload = init;
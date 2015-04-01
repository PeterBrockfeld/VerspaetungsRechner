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
    gesamtKosten = 0.0,
    letzteGesamtKosten = 0.0;

function parseTime(timeString) {
    "use strict";
    var time = timeString.match(/(\d?\d):?(\d?\d?)/),
        h = 0,
        m = 0,
        d = {};

    if (time === null) {
        return null;
    } else {

        h = parseInt(time[1], 10);
        m = parseInt(time[2], 10);

    }

    if ((h >= 0 && h <= 24) && (m >= 0 && m <= 59)) {
        d = new Date();
        d.setHours(h);
        d.setMinutes(m);
        d.setSeconds(0);
        return d;
    } else {
        return null;
    }
}

function kostenNeuErrechnen() {
    "use strict";
    var jetzt = new Date();
    gesamtKosten = 0.0;

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
    if (startZeit === null) {
        $("#startZeitInvalid").dialog("open");
    } else {
        $("#geplanterStart").html(startZeit.toLocaleTimeString() + "h");
    }
    durchschnittsKosten = parseFloat($("#sliderDKosten").slider("value"));
    anzahlEingeladene = parseInt($("#sliderGeladene").slider("value"), 10);
    $("#anzahlEingeladene").html(anzahlEingeladene.toString());
    einerMehr(); //jemand muss den Knopf betätigt haben :-)
    kostenNeuErrechnen();
    $("#tabs").tabs("option", "active", 0);
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
            heightStyle: "auto",
            active: 1
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
    $("#startZeitInvalid")
        .dialog({
            resizeable: false,
            height: 240,
            modal: true,
            autoOpen: false,
            buttons: {
                "OK": function () {
                    $("#inputStarttime").val("00:00");
                    $(this).dialog("close");
                }
            }
        });
});

function init() {
    "use strict";
    $("#titel").html("Titel des Treffens");
    $("#anzahlAnwesende").html(anzahlAnwesende.toString());
    $("#anzahlEingeladene").html(anzahlEingeladene.toString());
    $("#bisherigeKosten").html(gesamtKosten.toLocaleString('de-DE', {
        style: 'currency',
        currency: 'EUR'
    }));
    $("#auswahlDurchschnittskosten").html("9");
    $("#auswahlEingeladene").html("2");
}

window.onload = init;
/*jslint browser: true*/
/*globals $, jQuery, alert*/
/*
 * Verspätungskosten-Rechner
 * Peter Brockfeld, 2015-03-31
 */


var anzahlEingeladene = 0,
    startZeit = {},
    titel = '',
    durchschnittsKosten = 0.0,
    anzahlAnwesende = 0,
    bisherigeKosten = 0.0,
    letzteGesamtKosten = 0.0,
    //ankunftsZeiten wird die exakten Zeiten des Eintreffens der einzelnen Teilnehmer
    //aufnehmen. Über dieses Array läuft die Berechnung der aufgelaufenen Kosten.
    ankunftsZeiten = [];

/*
 * diese Funktion versucht aus der vom Anwender eingegebenen Startzeit
 * eine exakte Zeitangabe zu ermitteln. Wenn das _nicht_ klappt wird
 * "null" zurückgegeben, ansonsten die ermittelte Startzeit.
 */
function parseZeiteingabe(zeitAngabe) {
    "use strict";
    var zeit = zeitAngabe.match(/(\d?\d):?(\d?\d?)/),
        h = 0,
        m = 0,
        d = {};

    if (zeit === null) {
        return null;
    } else {
        h = parseInt(zeit[1], 10);
        m = parseInt(zeit[2], 10);
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

/*
 * diese Funktion berechnet bei jedem Aufruf die Kosten neu:
 *
 * die Ankunftszeiten der Anwesenenden sind im Array ankunftsZeiten
 * hinterlegt. Aus der Differenz zwischen Ankunftszeit und aktueller
 * Zeit kann für jeden Anwesenden die Zeit ermittelt werden, die er
 * bisher wartend erbracht hat. Zeit _vor_ dem Start des Meetings
 * wird nicht berücksichtigt.
 *
 * Aus der Wartezeit ergeben sich über die Durchschnittskosten die
 * Kosten pro wartendem Teilnehmer. Sie werden in der Variablen
 * "bisherigeKosten" aufsummiert.
 */
function kostenNeuErrechnen() {
    "use strict";
    var jetzt = new Date();
    bisherigeKosten = 0.0;

    function kostenHinzuAddieren(element, index, array) {
        var diff = element - startZeit,
            zeitInVeranstaltung = 0.0;
        if (diff > 0.0) { //Teilnehmer war verspätetet
            zeitInVeranstaltung = jetzt - element;
        } else { // Teilnehmer war (über-)pünktlich, die Kosten 
            // werden aber erst ab Veranstaltungsstart ermittelt.
            zeitInVeranstaltung = jetzt - startZeit;
        }
        // aus der in der Veranstaltung wartend verbrachte Zeit die aufgelaufenen
        // Kosten summieren:
        bisherigeKosten = bisherigeKosten + durchschnittsKosten * zeitInVeranstaltung / (3600000);

    }

    // nur rechnen, wenn a) noch nicht alle da sind und b) das Meeting begonnen hat
    if ((anzahlAnwesende < anzahlEingeladene) && (jetzt >= startZeit)) {
        ankunftsZeiten.forEach(kostenHinzuAddieren);
        letzteGesamtKosten = bisherigeKosten;
    } else {
        bisherigeKosten = letzteGesamtKosten;
    }

    // ermittelte Kosten in die Anzeige bringen:
    $("#bisherigeKosten").html(bisherigeKosten.toLocaleString('de-DE', {
        style: 'currency',
        currency: 'EUR'
    }));

    // Timer für nächste Berechnung stellen:
    setTimeout(kostenNeuErrechnen, 2000);
}

/*
 * wird gerufen, wenn ein weiterer Teilnehmer eintrifft:
 * der Zeitpunkt wird im Array "ankunftsZeiten" vermerkt,
 * die angezeigte Anzahl der Teilnehmer erhöht.
 */
function einerMehr() {
    "use strict";
    anzahlAnwesende = anzahlAnwesende + 1;
    ankunftsZeiten.push(new Date());
    $("#anzahlAnwesende").html(anzahlAnwesende);
}

/*
 * diese Funktion
 *  - übernimmt die vom Anwender gemachten Einstellungen in die Anzeige
 *  - beginnt das Array "ankunftsZeiten" mit dem, der die Einstellungen vornimmt
 *  - berechnet erstmalig die Kosten und startet dabei den Timer zur
 *    regelmäßigen Neuberechnung.
 */

function einstellungenUebernehmen() {
    "use strict";
    titel = $("#inputTitle").val();
    $("#titel").html(titel);

    // versuche, die angegebene Startzeit zu interpretieren. Wenn
    // das nicht klappt wird ein modaler Dialog aufgerufen, der
    // den Anwender bittet doch bitte eine Zeit im Format
    // HH:MM einzugeben.
    startZeit = parseZeiteingabe($("#inputStarttime").val());
    if (startZeit === null) {
        $("#startZeitInvalid").dialog("open");
    } else {
        $("#geplanterStart").html(startZeit.toLocaleTimeString() + "h");
    }

    durchschnittsKosten = parseFloat($("#sliderDKosten").slider("value"));
    anzahlEingeladene = parseInt($("#sliderGeladene").slider("value"), 10);
    $("#anzahlEingeladene").html(anzahlEingeladene.toString());

    // der erste Teilnehmer ist offensichtlich da:
    // - jemand muss den Knopf betätigt haben :-)
    einerMehr();

    // erstmalige Ksotenberechnung, dabei wird auch der Aktualisierungs-Timer
    // gestartet:
    kostenNeuErrechnen();

    // und Umschalten auf die Anzeige der laufenden Kosten:
    $("#tabs").tabs("option", "active", 0);
}

/*
 * jQueryUI functions: Buttons, Slider, Tabs und den modalen
 * Dialog (Fehlerhinweis zur Zeiteingabe) initialisieren:
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
            min: 10.0, //der Mindestlohn liegt tiefer, aber man hat Nebenkosten ...
            max: 125.0,
            step: 1.0,
            value: 40.0
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

/*
 * Vorbelegung der angezeigten Werte:
 */

function init() {
    "use strict";
    $("#titel").html("Titel des Treffens");
    $("#anzahlAnwesende").html(anzahlAnwesende.toString());
    $("#anzahlEingeladene").html(anzahlEingeladene.toString());
    $("#bisherigeKosten").html(bisherigeKosten.toLocaleString('de-DE', {
        style: 'currency',
        currency: 'EUR'
    }));
    $("#auswahlDurchschnittskosten").html("10");
    $("#auswahlEingeladene").html("2");
}

window.onload = init;
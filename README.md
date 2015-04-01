# Verspätungskosten-Rechner
 
## Inhalt/Contents

* [Sorry](#sorry)
* [Zweck](#zweck)
* [Verwendung](#verwendung)
* [License](#license) 

## Sorry

German only, the whole application is fitted to german circumstances.

## Zweck

Die Anwendung dient dazu die durch Unpünktlichkeit entstehenden Kosten bei Meetings darzustellen. Sie eignet sich als Ventil für Pedanten und Besserwisser, die verspäteten Teilnehmern eines Treffens die durch sie verursachten Schäden aufzeigen möchten.

## Verwendung

Die Anwendung ist eine HTML-Seite mit etwas CSS und JavaScript. Man kann sie auf einem Webserver hinterlegen oder direkt von der Festplatte starten. Das Einstiegsbild dient der Grundeinstellung:

* Titel oder Thema des Treffens
* geplante Startzeit
* Anzahl der geladenen Teilnehmer
* Durchschnittskosten (in € pro Stunde) pro Teilnehmer

Übernimmt man die getroffenen Einstellungen wechselt die Ansicht zum eigentlichen Rechner. Etwa alle 2 Sekunden werden die durch Warten auflaufenden Kosten ermittelt (ab dem in den Einstellungen übergebenen Starttermin, wer zu früh kommt wartet umsonst).

In der Anzeige kann man jeden eingetroffenen Teilnehmer zählen, die Kostenuhr läuft entsprechend schneller. Sind alle Eingeladenen anwesend hält die Anzeige an und das Meeting kann endlich beginnen. 

## License

Copyright (c) 2015 Peter Brockfeld. See the LICENSE.md file for license rights and limitations (MIT).
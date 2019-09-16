# Foto Server
Dieser Server hört auf ein POST-Request von der [Flashair](../flashair) SD-Karte. Anschließend wird über den Webserver der SD-Karte das Bild heruntergealden und verbundene Frontends per Websocket benachrichtigt.

## Installation
In [`express-server.js`](express-server.js) muss die URL der SD-Karte festgelegt werden. Anschließend kann der Webserver gestartet werden. Dieses muss unter Linux mit root-Rechten geschehen, weil standartmäßig Port 80 verwendet wird:
```
npm install
sudo node express-server.js
```
## Funktionsweise
Alle heruntergeladenen Bilder werden im Ordner `data` abgespeichert. 

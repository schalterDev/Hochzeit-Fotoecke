# Hochzeit-Fotoecke
Dieses Repository enhält drei Projekte für eine Fotoecke. Mit einer beliebigen Kamera (welche einen SD-Karten Slot hat) können Bilder gemacht werden und auf dem PC angesehen werden. Die Übertragung erfolgt über WLAN. Diese Bilder können auch direkt ausgedruckt werden.

## flashair
Die Dateien in diesem Ordner müssen auf eine Flashair SD-Karte kopiert werden (Version W-04). 

## foto-server
Ein express-Server, welcher die Bilder von der Kamera herunterlädt und diese über eine Websocket-Verbindung zur Verfügung stellt.

## hochzeit-foto-frontend
Eine Angular-Anwendung zum Anzeigen der Fotos.

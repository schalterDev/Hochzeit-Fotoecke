# Flashair
Mithilfe dieser Skripte können gemachte Fotos von der SD-Karte auf einen Computer über WLAN transferiert werden.

## Installation
Diese Dateien müssen auf eine Flashair SD-Karte der Version W-04 oder neuer kopiert werden. 
Die SD-Karte ist so konfiguriert sich mit einem vorhandem WLAN zu verbinden. 
Die SSID und das Passwort müssen in [SD_WLAN/CONFIG](SD_WLAN/CONFIG) angepasst werden.
Außerdem muss in [Settings.lua](Settings.lua) die IP-Adresse des Verbunden PC's eingetragen werden. Auf diesem PC muss der [express-Server](../foto-server) laufen. 
Wenn die Kamera die Bilder in einem anderem Ordner als `DCIM` speichert muss dieser Ordner auch angepasst werden.

## Funktionsweise
Sobald sich eine Datei auf der SD-Karte im festgelegten Ordner ändert (standartmäßig `DCIM`) wird das `sdwrite.lua` Script ausgeführt.
Dieses Script überprüft welche Datei neu hinzugekommen ist und schickt ein POST-Request an die hinterlegte IP-Adresse. 
Die SD-Karte hat einen eingebauten Webserver, worüber dann die neue Datei vom PC heruntergeladen wird. 

Zum Überprüfen, ob eine Datei neu ist oder schon vorher vorhanden war wird ein md5-Hash von jeder Datei erzeugt. Sobald der POST-Request für eine neue Datei erfoglreich abgesendet wurde wird eine Datei mit dem Hash unter `uploaded` erstellt.
Durch das Überprüfen ob eine bestimmte Datei mit dem Hash als Namen kann nun überprüft werden, ob diese Datei bereits übertragen worden ist.

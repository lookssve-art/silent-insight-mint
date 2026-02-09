# ✅ Website mit echtem NFT-Bestand verknüpft

## Was wurde gemacht:

1. **Website aktualisiert:**
   - Counter ruft jetzt echte Daten vom Backend ab
   - Aktualisiert alle 10 Sekunden automatisch
   - Verwendet `http://localhost:3000/v1/alignment/stats` für lokale Entwicklung

2. **Backend Stats-Endpoint:**
   - Gibt echten Bestand zurück (`minted` aus Backend-Speicher)
   - CORS-Headers für Website-Zugriff
   - Cache-Control für Live-Updates

3. **Automatische Updates:**
   - Website aktualisiert Counter alle 10 Sekunden
   - Zeigt echten Bestand: `X/999`
   - NFT-Display wird basierend auf Bestand aktualisiert

## So funktioniert es:

1. **Backend zählt NFTs:**
   - Jedes gemintete NFT wird gezählt
   - Gespeichert in In-Memory oder PostgreSQL

2. **Website fragt Backend ab:**
   - Ruft `/v1/alignment/stats` auf
   - Bekommt `{minted: X, total_supply: 999}`
   - Aktualisiert Counter: `X/999`

3. **Live-Updates:**
   - Alle 10 Sekunden neue Abfrage
   - Counter wird automatisch aktualisiert
   - Kein Seiten-Reload nötig

## Testen:

1. **Öffne Website:** http://localhost:8080
2. **Mint ein NFT:** `node mint_key.js ...`
3. **Warte 10 Sekunden** - Counter sollte sich aktualisieren
4. **Oder:** Aktualisiere Seite manuell (F5)

## Für Produktion:

Ändere in `index.html` die API-URL:
```javascript
apiBase = 'https://api.silent-insight.com/v1';
```

Oder verwende automatische Erkennung (bereits implementiert).

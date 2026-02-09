# Was ist das Backend? 🤔

## Einfache Erklärung

**Das Backend ist der Server, der im Hintergrund läuft und alle wichtigen Dinge macht:**

### Was macht das Backend?

1. **NFT-Minting** 🎨
   - Erstellt echte NFTs auf Solana Blockchain
   - Verwaltet die Collection
   - Prüft Limits (999 NFTs max, 10 pro Wallet)

2. **Alignment-Protokoll** 🔐
   - Führt die 4 Stufen durch (Declare, Silence, Verify, Authorize)
   - Prüft ob alles korrekt ist
   - Verhindert Betrug

3. **Free Mint** 🆓
   - Erkennt ob Wallet `54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7` kostenlos minten kann
   - Alle anderen zahlen 0.025 SOL

4. **SOL Transfer** 💰
   - Sendet SOL an `54EYFfVLAsvP3khBHqnmam3WGAo6Kg9TPLL9EZZc14g7` nach jedem Kauf

## Warum braucht man das Backend?

**Ohne Backend = Keine NFTs möglich!**

- Die Website (`index.html`) kann nicht direkt mit Solana kommunizieren
- Das Backend macht die komplizierten Blockchain-Operationen
- Das Backend verwaltet alle Limits und Regeln

## Wie funktioniert es?

```
User → Website (Frontend) → Backend API → Solana Blockchain
                              ↓
                         NFT wird erstellt!
```

## Wo läuft das Backend?

### Lokal (nur für dich):
- Auf deinem Computer
- URL: `http://localhost:3000`
- Nur du kannst darauf zugreifen

### Öffentlich (für alle):
- Auf einem Server im Internet
- URL: z.B. `https://silent-insight-api.railway.app`
- Jeder kann darauf zugreifen

## Wie mache ich es öffentlich?

### Option 1: Railway (Empfohlen - Einfach)

1. Gehe zu https://railway.app
2. Login mit GitHub
3. "New Project" → "Deploy from GitHub"
4. Wähle `backend/` Ordner
5. Setze Environment Variables
6. Deploy!

→ Backend ist jetzt öffentlich! 🎉

### Option 2: Render

1. Gehe zu https://render.com
2. "New Web Service"
3. Verbinde GitHub
4. Root Directory: `backend`
5. Deploy!

### Option 3: Fly.io

1. Installiere Fly CLI
2. `fly launch` im `backend/` Ordner
3. `fly deploy`

## Was muss ich noch tun?

Nachdem das Backend öffentlich ist:

1. **Frontend anpassen:**
   - Ändere die API URL in `index.html`
   - Von `http://localhost:3000` zu deiner öffentlichen URL

2. **Frontend deployen:**
   - Cloudflare Pages (kostenlos)
   - Vercel (kostenlos)
   - Netlify (kostenlos)

3. **Testen:**
   - Öffne deine Website
   - Versuche ein NFT zu minten
   - Prüfe ob es funktioniert!

## Zusammenfassung

- **Backend** = Server der NFTs erstellt
- **Ohne Backend** = Keine NFTs möglich
- **Öffentlich machen** = Auf Railway/Render/Fly.io deployen
- **Frontend** = Website die User sehen
- **Beide müssen öffentlich sein** = Dann kann jeder minten!

Siehe `QUICK-DEPLOY.md` für Schritt-für-Schritt Anleitung! 🚀

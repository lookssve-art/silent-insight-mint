# 🌐 Kostenlose Domain für Key of Silent Insight

## Option 1: Cloudflare Pages (EMPFOHLEN - 100% Kostenlos)

**Schritte:**
1. Gehe zu https://dash.cloudflare.com/
2. Erstelle einen kostenlosen Account (falls noch nicht vorhanden)
3. Klicke auf "Pages" → "Create a project"
4. Wähle "Upload assets"
5. Ziehe diese Dateien per Drag & Drop hoch:
   - `index.html`
   - `orb-video.mp4`
6. Projektname: `key-of-silent-insight`
7. Klicke auf "Deploy"

**Deine kostenlose Domain wird sein:**
```
https://key-of-silent-insight.pages.dev
```

**Vorteile:**
- ✅ 100% kostenlos
- ✅ SSL-Zertifikat inklusive
- ✅ Unbegrenzte Bandbreite
- ✅ Schnell und zuverlässig

---

## Option 2: Vercel (Kostenlos)

**Schritte:**
1. Gehe zu https://vercel.com/
2. Erstelle einen Account mit GitHub/GitLab/Bitbucket
3. Installiere Vercel CLI (bereits installiert):
   ```bash
   npm install -g vercel
   ```
4. Führe aus:
   ```bash
   cd /Users/moneyboy/.openclaw/workspace/skills/silent-insight-mint
   vercel login
   vercel --yes
   ```

**Deine kostenlose Domain wird sein:**
```
https://silent-insight-mint.vercel.app
```
(oder ähnlich)

---

## Option 3: Netlify (Kostenlos)

**Schritte:**
1. Gehe zu https://app.netlify.com/
2. Erstelle einen Account
3. Ziehe den Ordner `/Users/moneyboy/.openclaw/workspace/skills/silent-insight-mint` per Drag & Drop auf die Netlify-Seite
4. Fertig!

**Deine kostenlose Domain wird sein:**
```
https://silent-insight-mint.netlify.app
```

---

## Option 4: Lokale Domain (Für Entwicklung)

**Für lokales Testen:**

1. Öffne Terminal und führe aus:
   ```bash
   sudo sh -c 'echo "127.0.0.1 keyofsilentinsights.local" >> /etc/hosts'
   ```

2. Starte den Server:
   ```bash
   cd /Users/moneyboy/.openclaw/workspace/skills/silent-insight-mint
   ./setup-local-domain.sh
   ```

3. Öffne im Browser:
   ```
   http://keyofsilentinsights.local:8080
   ```

---

## 🎯 Empfehlung

**Für Produktion:** Cloudflare Pages (Option 1) - am einfachsten und schnellsten
**Für Entwicklung:** Lokale Domain (Option 4)

---

## 📝 Nach dem Deployment

Nachdem du eine Domain hast, aktualisiere die API-URL im Script:
```javascript
const API_BASE = 'https://deine-domain.com/v1';
```

Oder setze die Umgebungsvariable:
```bash
export SILENT_INSIGHT_API=https://deine-domain.com/v1
```

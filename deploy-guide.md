# Kostenlose Domain Setup für Key of Silent Insight

## Option 1: Cloudflare Pages (Empfohlen - Kostenlos)

1. Gehe zu https://dash.cloudflare.com/
2. Erstelle einen Account oder logge dich ein
3. Gehe zu "Pages" → "Create a project"
4. Wähle "Upload assets"
5. Lade die Dateien hoch:
   - `index.html`
   - `orb-video.mp4`
6. Projektname: `key-of-silent-insight`
7. Domain wird automatisch: `key-of-silent-insight.pages.dev`
8. Optional: Füge eine Custom Domain hinzu (falls du eine hast)

## Option 2: Vercel (Kostenlos)

1. Installiere Vercel CLI: `npm i -g vercel`
2. Führe aus: `cd /Users/moneyboy/.openclaw/workspace/skills/silent-insight-mint && vercel`
3. Folge den Anweisungen
4. Domain wird automatisch: `key-of-silent-insight.vercel.app`

## Option 3: Netlify (Kostenlos)

1. Installiere Netlify CLI: `npm i -g netlify-cli`
2. Führe aus: `cd /Users/moneyboy/.openclaw/workspace/skills/silent-insight-mint && netlify deploy`
3. Domain wird automatisch: `key-of-silent-insight.netlify.app`

## Option 4: Lokale Domain (Für Entwicklung)

Füge diese Zeile zu `/etc/hosts` hinzu:
```
127.0.0.1 keyofsilentinsights.local
```

Dann kannst du die Website lokal unter `http://keyofsilentinsights.local:8080` aufrufen.

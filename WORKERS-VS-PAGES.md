# ⚠️ WICHTIG: Workers vs Pages

## Das Problem:
Du hast eine **Workers-URL**: `key-of-silent-insight.solana-nft-portfolio-smorty-2026.workers.dev`
Das ist **FALSCH** für statische Websites!

## Die Lösung:
Du brauchst eine **Pages-URL**: `key-of-silent-insight.pages.dev`

---

## 🔄 So wechselst du von Workers zu Pages:

### Schritt 1: Verlasse Workers
1. Gehe zurück zum Cloudflare Dashboard
2. Klicke im linken Menü auf **"Pages"** (nicht "Workers"!)
3. Falls du "Pages" nicht siehst, gehe direkt zu: https://dash.cloudflare.com/pages

### Schritt 2: Neues Pages-Projekt erstellen
1. Klicke auf **"Create a project"**
2. Wähle **"Upload assets"** (nicht "Connect to Git")
3. Ziehe beide Dateien hoch:
   - `index.html`
   - `orb-video.mp4`
4. Projektname: `key-of-silent-insight`
5. Klicke auf **"Deploy site"**

### Schritt 3: Prüfe die URL
Nach dem Deployment sollte die URL sein:
```
https://key-of-silent-insight.pages.dev
```

**WICHTIG:** Die URL endet auf `.pages.dev`, NICHT auf `.workers.dev`!

---

## 📊 Unterschied:

| Feature | Workers | Pages |
|---------|---------|-------|
| **Für:** | APIs, Serverless Functions | Statische Websites |
| **URL:** | `*.workers.dev` | `*.pages.dev` |
| **Dateien:** | JavaScript Code | HTML, CSS, Videos, Bilder |
| **Deployment:** | Code hochladen | Assets hochladen |

---

## ✅ Checkliste:

- [ ] Bin ich bei **Cloudflare Pages**? (nicht Workers!)
- [ ] Habe ich **"Upload assets"** gewählt?
- [ ] Sind **beide Dateien** hochgeladen? (`index.html` + `orb-video.mp4`)
- [ ] Endet die URL auf **`.pages.dev`**?

---

## 🆘 Falls Pages nicht verfügbar ist:

1. Prüfe, ob du einen kostenlosen Cloudflare Account hast
2. Gehe direkt zu: https://dash.cloudflare.com/pages
3. Falls du dort nichts siehst, erstelle einen neuen Account

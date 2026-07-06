# Muhimu Technologie Website

Site internet officiel de Muhimu Technologie : présentation de l'entreprise, services digitaux, solutions, actualités et contact.

## Structure

```text
.
├── index.html
├── about.html
├── services.html
├── solutions.html
├── finance-erp.html
├── blog.html
├── contact.html
├── en/
│   ├── index.html
│   ├── about.html
│   ├── services.html
│   ├── solutions.html
│   ├── finance-erp.html
│   ├── blog.html
│   └── contact.html
├── assets/
│   ├── css/styles.css
│   ├── js/main.js
│   └── images/
│       ├── favicon.svg
│       ├── hero-muhimu-tech-jk-style.webp
│       ├── muhimu-logo-full.png
│       ├── muhimu-logo-symbol-dark.png
│       └── muhimu-logo-symbol-transparent.png
├── Dockerfile
├── nginx.conf
└── README.md
```

## Lancer localement

Le site est statique. Vous pouvez ouvrir directement `index.html` dans un navigateur.

Option avec un serveur local si Python 3 est disponible :

```powershell
cd "C:\Users\surface pro7\Documents\muhimu website"
python -m http.server 8000
```

Sur cette machine, si `python --version` affiche Python 2.7, utilisez plutôt :

```powershell
cd "C:\Users\surface pro7\Documents\muhimu website"
python -m SimpleHTTPServer 8000
```

Puis ouvrir :

```text
http://localhost:8000
```

## Déploiement Docker/Nginx

Construire l'image :

```powershell
docker build -t muhimu-website .
```

Lancer le conteneur :

```powershell
docker run --rm -p 8080:80 muhimu-website
```

Puis ouvrir :

```text
http://localhost:8080
```

## Préparation backend

Le formulaire de contact est actuellement statique. Pour connecter un backend plus tard, remplacer la logique dans `assets/js/main.js` par un appel `fetch()` vers une API, par exemple `/api/contact`.

Les cartes du blog sont structurées pour pouvoir être générées depuis une API, un CMS ou un fichier JSON.

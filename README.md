# Muhimu Technologie

Site statique orienté technologie financière : ERP SYSCOHADA, facturation, trésorerie et reporting.

Les nouvelles pages françaises sont index.html, services.html, solutions.html, entreprise.html et contact.html. Le blog et les pages anglaises adoptent le même design animé et le même positionnement fintech / ERP SYSCOHADA. Les anciennes adresses about.html et finance-erp.html redirigent vers leurs nouvelles destinations.

## Prévisualisation

Depuis ce dossier, lancer `python -m http.server 8000`, puis ouvrir http://localhost:8000. Aucun build npm requis.

## Docker / Nginx

Construire : `docker build -t muhimu-website .`

Tester sur un port disponible : `docker run --rm -p 8080:80 muhimu-website`

Ouvrir http://localhost:8080 et vérifier les pages avant de remplacer le conteneur de production. Adapter le lancement à la configuration existante du VPS (réseau, reverse proxy, ports, Docker Compose). Le certificat HTTPS et le reverse proxy public restent gérés par le serveur existant. Conserver l'ancienne image pour un retour arrière.

Nginx accepte les liens avec ou sans .html, compresse CSS/JavaScript/SVG et revalide les ressources entre les versions. .dockerignore exclut les métadonnées Git et les fichiers de travail de l'image.

## Contact

Le formulaire crée un brief local : copie, téléchargement et ouverture du logiciel de messagerie vers info@muhimu.tech. Il ne transmet pas automatiquement un message au serveur. Une API est nécessaire pour un envoi direct.

## Maintenance

Les pages françaises utilisent style.css et app.js à la racine. Les pages anglaises partagent style.css et utilisent app.en.js pour les interactions en anglais. Le blog propose trois guides consultables directement sur la page. Le logo officiel est décliné en WebP 1x/2x/4x ; le favicon SVG est conservé.

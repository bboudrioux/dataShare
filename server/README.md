# 📁 DataShare API - Plateforme de partage de fichiers sécurisée

**DataShare** est une application fullstack permettant d'héberger des fichiers volumineux (jusqu'à 1 Go) avec un contrôle total sur la confidentialité et la durée de vie des données.

## 🌟 Fonctionnalités clés

- **Gestion des fichiers** :
  - Upload jusqu'à **1 Go**.
  - Génération d'ID uniques (UUID) pour le partage.
- **Sécurité** :
  - Authentification **JWT** (Passport-JWT).
  - Protection optionnelle des fichiers par **mot de passe**.
  - Guards personnalisés pour la vérification de propriété (`FileOwnerGuard`).
- **Partage Public** :
  - Liens de téléchargement directs sans authentification requise.
  - Vérification de la date d'expiration avant accès.
- **Maintenance Automatisée** :
  - **Cron Job** horaire pour le nettoyage du stockage physique et de la base de données.
- **Documentation** :
  - Interface **Swagger** intégrée et accessible via `/api/docs`.

---

## 🛠️ Stack Technique

- **Backend** : NestJS, Prisma ORM, Multer, Passport.js.
- **Frontend** : React.
- **Base de données** : PostgreSQL.
- **DevOps** : Docker, Docker Compose.

---

## 🚀 Installation et Lancement

Le projet est entièrement conteneurisé pour faciliter le déploiement local.

### 1. Variables d'environnement

Créez un fichier `.env` à la racine du dossier **backend** :

```env
DATABASE_URL="postgresql://user:passworddb:5432/datashare?schema=public"
JWT_SECRET="votre_secret_tres_long_et_securise"
```

### 2. Démarrage avec Docker

Lancez la commande suivante à la racine du projet (où se trouve le `docker-compose.yml`) :

```bash
docker-compose up --build
```

- **Frontend** : `http://localhost:5173`
- **Backend API** : `http://localhost:3000/api`
- **Documentation Swagger** : `http://localhost:3000/api/docs` (ou redirection via `http://localhost:3000/api`)

---

## 📖 Utilisation de l'API

L'API est préfixée par `/api`. Voici les endpoints principaux :

### Authentification (`/api/auth`)

- `POST /register` : Création de compte.
- `POST /login` : Connexion (retourne un JWT).

### Gestion des fichiers (`/api/files`) - _JWT Requis_

- `POST /upload` : Upload multipart (champ `file`, `password?`, `expiration_date?`).
- `GET /` : Liste les fichiers de l'utilisateur.
- `DELETE /:id` : Supprime un fichier.

### Liens de partage (`/api/share`) - _Public_

- `GET /:id` : Métadonnées du fichier (nom, type, taille, expiration).
- `GET /:id/download` : Téléchargement du binaire (Query param `password` si protégé).

---

## 🧹 Tâches de fond (Cron)

L'application exécute un script de nettoyage toutes les heures (`0 * * * *`). Ce script :

1. Récupère tous les fichiers dont la `expiration_date` est passée.
2. Supprime le fichier physique du dossier `./uploads`.
3. Supprime l'entrée correspondante dans PostgreSQL via Prisma.

---

## 🛡️ Sécurité & CORS

L'API est sécurisée par **Helmet** pour les headers HTTP et une configuration **CORS** stricte permettant uniquement aux domaines autorisés (localhost en développement) de consommer les ressources.

---

_Développé dans le cadre d'un projet de partage de données sécurisé._

# 📁 dataShare - Plateforme de partage de fichiers sécurisée

dataShare est une application fullstack permettant d'héberger et de partager des fichiers volumineux (jusqu'à 1 Go) avec un contrôle total sur la confidentialité et la durée de vie des données.

## 📂 Structure du Projet

- **`/server`** : API NestJS avec Prisma ORM (PostgreSQL).
- **`/client`** : Interface React (Vite, TypeScript).

## 🛠️ Stack Technique Globale

- **Frontend** : React, Vite, Axios, React-Toastify.
- **Backend** : NestJS, Prisma, Multer, Passport-JWT.
- **Base de données** : PostgreSQL.
- **Infrastructure** : Docker & Docker Compose.

## 🚀 Lancement Rapide (Docker)

1. **Variables d'environnement** :
   Créez un fichier `.env` dans le dossier `server` avec les accès DB et le secret JWT.

2. **Démarrage complet** :
   À la racine du projet (là où se trouve le `docker-compose.yml`) :

   ```bash
   docker-compose up --build
   ```

3. **Accès aux services** :
   - **Frontend** : http://localhost:5173
   - **API Backend** : http://localhost:3000/api
   - **Swagger Docs** : http://localhost:3000/api/docs (accessible aussi via /api)

## 🛡️ Sécurité & Authentification

- **JWT & Bearer Token** : L'accès aux ressources privées est protégé par un `AuthGuard` global ou par endpoint. Le client doit envoyer un jeton JWT valide dans le header `Authorization: Bearer <token>`.
- **Validation JWT** : Un service dédié (`JwtService`) gère la signature et la vérification de l'intégrité des jetons.
- **Expiration des fichiers** : Chaque fichier a une date de fin de validité définie lors de l'upload.
- **Nettoyage automatique** : Un Cron Job supprime les fichiers expirés physiquement et en base toutes les heures.
- **Protection par mot de passe** : Chiffrement optionnel des liens de téléchargement.
- **Contrôle d'accès (RBAC/Ownership)** : Utilisation de `FileOwnerGuard` pour interdire la suppression ou la modification de fichiers par d'autres utilisateurs.

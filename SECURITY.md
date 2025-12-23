# 🛡️ Politique de Sécurité - dataShare

Ce document détaille les mesures de sécurité implémentées pour garantir l'intégrité des fichiers et la confidentialité des utilisateurs.

## 🔐 Authentification et Autorisation

- **JWT (JSON Web Token)** : Authentification stateless via `Passport-JWT`. Le jeton est requis pour toutes les routes `/api/files`.
- **Bearer Token** : Les jetons doivent être transmis via le header `Authorization: Bearer <token>`.
- **AuthGuard** : Un guard global intercepte les requêtes pour vérifier la validité et l'expiration du JWT.
- **FileOwnerGuard** : Guard de niveau ressource garantissant qu'un utilisateur ne peut modifier ou supprimer que les fichiers dont il est le propriétaire (`ownerId`).

## 📁 Protection des Fichiers

- **Mots de passe** : Protection optionnelle via un hash comparé lors de la requête de téléchargement.
- **Isolation du stockage** : Les fichiers sont renommés avec des UUID lors de l'upload pour éviter les attaques par énumération de fichiers.
- **Limites de taille** : Restriction stricte à 1 Go via Multer pour prévenir les attaques par déni de service (DoS) sur le stockage.

## 🚀 Sécurité Réseau & Serveur

- **Helmet** : Utilisation du middleware Helmet dans NestJS pour configurer les headers HTTP sécurisés (CSP, HSTS, X-Frame-Options).
- **CORS** : Configuration stricte autorisant uniquement l'origine du client (localhost:5173 en développement).
- **Validation des données** : Utilisation de `class-validator` et `ValidationPipe` pour assainir toutes les entrées utilisateur.

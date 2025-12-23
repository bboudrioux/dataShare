# 💻 dataShare Client

Interface utilisateur moderne pour la plateforme dataShare, permettant l'upload, la gestion et le téléchargement de fichiers sécurisés.

## ⚙️ Configuration

| Nom              | Valeur                    |
| :--------------- | :------------------------ |
| **Framework**    | React 18+ (Vite)          |
| **Langage**      | TypeScript                |
| **Base URL API** | http://localhost:3000/api |
| **Port de dév**  | 5173                      |

## 🚀 Installation locale (sans Docker)

1. Allez dans le dossier client :
   ```bash
   cd client
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Lancez le client :
   ```bash
   npm run dev
   ```

## 🔐 Gestion de l'Authentification

L'application sécurise les échanges avec le serveur via :

- **Stockage Local** : Conservation sécurisée du JWT (JSON Web Token) après authentification.
- **Intercepteurs Axios** : Injection systématique du `Bearer Token` dans le header `Authorization` pour toutes les requêtes vers les routes protégées du serveur.
- **Protection des Routes** : Système de redirection automatique vers la page de connexion pour les utilisateurs non authentifiés tentant d'accéder au Dashboard.

## ✨ Fonctionnalités UI

- **Authentification (Login / Register)** :
  - Formulaires de création de compte et de connexion avec validation des données.
  - Gestion des retours d'erreurs API (identifiants incorrects, utilisateur déjà existant).
- **Dashboard** : Vue d'ensemble des fichiers personnels avec badges de sécurité (🔒) pour les fichiers protégés et indicateurs de statut.
- **Filtres intelligents** : Tri dynamique des fichiers par état (Tous / Actifs / Expirés).
- **Upload Card** : Interface de téléversement permettant de configurer le fichier, un mot de passe optionnel et la durée de validité (1h, 1j, 1semaine).
- **Download Card** : Page publique de récupération accessible via lien UUID, incluant des alertes visuelles sur le temps restant avant expiration.

## 🛠 Outils utilisés

- **Axios** : Communication asynchrone avec l'API NestJS.
- **React Router** : Gestion de la navigation SPA et des routes dynamiques pour le partage (`/files/:id`).
- **React Toastify** : Feedback utilisateur instantané via notifications (succès d'upload, erreur de mot de passe, expiration).

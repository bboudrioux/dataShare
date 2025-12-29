# 🧪 Stratégie de Test - dataShare

Ce projet utilise une approche de tests pyramidale couvrant à la fois l'API (Node.js/Nest) et l'interface utilisateur (React/Vite).

## 🛠️ Niveaux de Tests

### 1. Tests Côté Serveur (Backend)

- **Tests Unitaires** : Validation des services (`AuthService`, `FileService`) via **Jest**.
- **Tests d'Intégration** : Validation du cycle de vie d'un fichier (Upload -> Stockage -> Base de données -> Suppression) via **Supertest**.

### 2. Tests Côté Client (Frontend)

- **Tests de Composants (UI)** : Validation du rendu et de l'interactivité via **React Testing Library** et **Jest**.
  - _Dashboard_ : Gestion du cycle de vie des fichiers, filtrage par statut (Tous/Actifs/Expirés) et asynchronisme.
  - _Modales_ : Validation des flux de confirmation (suppression) et d'upload.
  - _Navigation & Sidebars_ : Gestion des états d'ouverture, déconnexion et redirection de session.
- **Tests de Logique (Utils)** : Validation des fonctions pures (formateurs de poids de fichiers et gestion des labels d'expiration).
- **Mocks de Services** : Isolation complète des composants vis-à-vis de l'API via `jest.mock` pour garantir des tests déterministes.

### 3. Tests de Bout-en-Bout (E2E)

- **Technologie** : **Cypress**.
- **Flux couvert** :
  1. Création de compte (Register).
  2. Connexion (Login).
  3. Navigation vers le Dashboard.
  4. Upload d'un fichier réel.
  5. Vérification de la génération du lien (Download/Access).
  6. Suppression du fichier.
  7. Déconnexion (Logout).

---

## 📋 Scénarios Critiques Testés

### 🔒 Authentification & Sécurité

- **Accès Protégé** : Tentative d'accès aux fichiers sans token valide (401 Unauthorized).
- **Gestion de Session** : Suppression du token local (Context) et redirection automatique vers `/login`.
- **Sécurité des Données** : Vérification que les actions de suppression sont protégées contre les accès non autorisés (403 Forbidden).

### 📂 Gestion des Fichiers

- **Contraintes d'Upload** : Blocage préventif côté client des fichiers dépassant la limite de 1 Go.
- **Intégrité du Dashboard** : Rechargement de la liste des fichiers après suppression ou upload réussi pour garantir la cohérence des données.
- **Fichiers Expirés** : Masquage automatique des badges de sécurité et des actions pour les fichiers dont la date d'expiration est dépassée.

### ⌨️ Expérience Utilisateur (UX)

- **Accessibilité** : Fermeture des modales via la touche `Echap` (Événements clavier keyDown).
- **Feedback visuel** : Validation de l'affichage des notifications `react-toastify` lors des succès ou échecs d'appels API.

---

## 📈 Couverture de code

Objectif de couverture globale : **75%**.

| Couche       | Technologie      | Objectif |
| :----------- | :--------------- | :------- |
| **Backend**  | Jest / Supertest | 75%      |
| **Frontend** | Jest / RTL       | 75%      |

---

## 🚀 Commandes de Test

```bash

# --- CLIENT (Frontend) ---

# Lancer les tests unitaires avec Jest

npm run test

# Générer le rapport de couverture (Coverage)

npm run test:cov

# Lancer test e2e en mode interface
npx cypress open

# Lancer e2e en mode console (Headless)
npm run test:e2e

# --- SERVEUR (Backend) ---

# Lancer les tests unitaires

npm run test

# Lancer les tests integrations

npm run test:integration
```

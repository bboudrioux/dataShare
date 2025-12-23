# 🧪 Stratégie de Test - dataShare

## 🛠️ Niveaux de Tests

1. **Tests Unitaires (Back)** : Validation des services (AuthService, FileService) via Jest.
2. **Tests d'Intégration** : Validation du cycle de vie d'un fichier (Upload -> Stockage -> Base de données -> Suppression).
3. **Tests de bout en bout (E2E)** : Simulation d'un parcours utilisateur (Register -> Login -> Upload).

## 📋 Scénarios Critiques Testés

- **Auth** : Tentative d'accès à `/api/files` sans Bearer Token (doit retourner 401).
- **Upload** : Refus des fichiers dépassant 1 Go.
- **Sécurité** : Tentative de suppression d'un fichier par un non-propriétaire (doit retourner 403).
- **Expiration** : Vérification que le fichier devient inaccessible dès que `expiration_date` est passée.

## 📈 Couverture de code

Objectif de couverture globale : **75%**.

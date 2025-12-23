# ⚡ Budget de Performance - dataShare

## 🖥️ Performance Front-end (React)

- **Poids du Bundle** : Cible < 250 KB (minifié/compressé) pour un chargement initial rapide.
- **Lighthouse Score** : Objectif > 90 sur la performance et l'accessibilité.
- **Optimisations** :
  - Utilisation du Lazy Loading pour les routes lourdes.
  - Compression des assets statiques via Vite.

## ⚙️ Performance Back-end (NestJS)

- **Temps de réponse** :
  - API Metadata (`GET /share/:id`) : < 80ms.
  - Authentification : < 150ms (bcrypt hashing).
- **Gestion de la charge** :
  - Utilisation de `Streams` pour le téléchargement afin de ne pas saturer la RAM du serveur lors du transfert de fichiers de 1 Go.
  - Indexation PostgreSQL sur les champs `ownerId` et `uuid`.

## 📊 Métriques Clés de Suivi

- **Taille moyenne des fichiers** : 50 Mo.
- **Temps d'upload (Fibre)** : ~10s pour 100 Mo.
- **Analyse d'optimisation** : Prévision d'implémenter Redis pour le cache des métadonnées si le nombre de partages publics explose.

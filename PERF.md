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

## 🚀 Résultats des Tests de Charge (k6)

Des tests de performance ont été réalisés sur l'endpoint critique d'upload (`POST /api/files/upload`) pour valider la stabilité du système.

- **Configuration du test** :
  - Charge : Jusqu'à 10 utilisateurs virtuels (VUs) simultanés.
  - Durée : 2 minutes (montée en charge, plateau, descente).
- **Métriques obtenues** :
  - **Taux de succès** : 100% (877 requêtes réussies sur 877).
  - **Débit (Throughput)** : ~7.3 uploads / seconde.
  - **Latence (p95)** : 110.94 ms (95% des requêtes traitées en moins de 111ms).
  - **Latence moyenne** : 45.46 ms.
- **Conclusion** : Le serveur encaisse parfaitement une charge modérée avec une latence très faible, confirmant l'efficacité du traitement des fichiers.

## 📊 Métriques Clés de Suivi

- **Taille moyenne des fichiers** : 50 Mo.
- **Temps d'upload (Fibre)** : ~10s pour 100 Mo.
- **Analyse d'optimisation** : Prévision d'implémenter Redis pour le cache des métadonnées si le nombre de partages publics explose.

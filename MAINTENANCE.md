# 🔧 Plan de Maintenance - dataShare

## 🧹 Automatisation

- **Cron Job** : Nettoyage horaire (`0 * * * *`) des fichiers expirés.
  - Risque : Si le script échoue, le stockage peut saturer.
  - Surveillance : Logs de la tâche Cron dans les conteneurs Docker.

## 📦 Gestion des Dépendances

- **Fréquence** : Mise à jour mensuelle des packages via `npm update`.
- **Audit de sécurité** : Exécution hebdomadaire de `npm audit` pour identifier les vulnérabilités dans les librairies tierces.

## ⚠️ Risques Identifiés

- **Stockage** : Risque de saturation disque. Solution : Monitoring de l'espace disque sur le serveur hôte.
- **Migration DB** : Toujours effectuer une sauvegarde de PostgreSQL avant de lancer `npx prisma migrate deploy`.
- **Breaking Changes** : Surveillance particulière lors des mises à jour majeures de NestJS ou Prisma.

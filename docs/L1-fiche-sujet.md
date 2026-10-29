# Livrable 1 : fiche de sujet

**Titre :** Infrastructure AWS 3 tiers hautement disponible
**Membres :** Majdeddine Mohamed / Oussema Rhim
**Dépôt Git :** https://github.com/MM95w/aws-3tier-infra

## Application retenue
StockFlow, gestion de stock et de commandes (source : github.com/rwxvishali/stockflow-inventory).
Rôles Admin / Manager / Staff, commandes de vente et d'achat avec ajustement atomique du stock,
alertes de stock bas, tableau de bord.

## Composants
- Front : React 18 + TypeScript + Vite (fichiers statiques servis par Nginx)
- API : Node.js + Express + TypeScript, authentification JWT
- Base : PostgreSQL via Prisma, hébergée sur Amazon RDS

## Objectifs non fonctionnels
| Objectif | Cible |
|---|---|
| Tolérance à la perte d'une instance | 1 sur 2 perdue sans coupure |
| Charge nominale / pointe | 20 req/s / 100 req/s |
| Reconstruction complète | moins de 15 min |
| Perte de données maximale (RPO) | 24 h |
| Budget par étudiant | moins de 25 USD |


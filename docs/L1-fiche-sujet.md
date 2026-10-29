# Livrable 1 : fiche de sujet

**Titre :** Infrastructure AWS 3 tiers hautement disponible pour StockFlow
**Membres :** Majdeddine Mohamed / Oussema Rhim
**Dépôt Git :** https://github.com/MM95w/aws-3tier-infra

## Application retenue
StockFlow, gestion de stock et de commandes (source : github.com/rwxvishali/stockflow-inventory).
Rôles Admin / Manager / Staff, commandes de vente et d'achat avec ajustement atomique du stock,
alertes de stock bas, tableau de bord.

## Composants
- Front : React  + TypeScript + Vite (fichiers statiques servis par Nginx)
- API : Node.js + Express + TypeScript, authentification JWT
- Base : PostgreSQL via Prisma, hébergée sur Amazon RDS

## Objectifs non fonctionnels
| Objectif | Cible | Démonstration |
|---|---|---|
| Tolérance à la perte d'une instance | 1 sur 2 perdue sans coupure | Terminaison manuelle en direct |
| Charge nominale / pointe | 20 req/s / 100 req/s | Test k6 ou Locust |
| Reconstruction complète | moins de 15 min | apply.sh chronométré |
| Perte de données maximale (RPO) | 24 h | Restauration d'un snapshot RDS |
| Budget par étudiant | moins de 25 USD | Relevés dans docs/compte-aws.md |

## Faisabilité
Services du CDC : VPC, SG, EC2, EBS, ALB, ASG, RDS, S3, CloudWatch, IAM (LabRole).
Accès sortant : NAT instance (voir ADR-001).
Risques : crédit épuisé, session expirée, limites de LabRole, état Terraform partagé,
gestion des secrets de l'application, cookie Secure sans HTTPS.


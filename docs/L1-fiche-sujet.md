# Livrable 1 : fiche de sujet

**Titre :** Infrastructure AWS 3 tiers hautement disponible
**Membres :** Majdeddine Mohamed / Oussema Rhim
**Dépôt Git :** https://github.com/MM95w/aws-3tier-infra

## Application retenue
Projet open source `aws-samples/aws-three-tier-web-architecture-workshop`
(React, Node.js, MySQL), licence MIT-0. Seul le code applicatif est repris,
toute l'infrastructure est écrite en Terraform.

## Composants
- Front React servi par Nginx
- API Node.js
- Base MySQL sur RDS

## Objectifs non fonctionnels
| Objectif | Cible |
|---|---|
| Tolérance à la perte d'une instance | 1 sur 2 perdue sans coupure |
| Charge nominale / pointe | 20 req/s / 100 req/s |
| Reconstruction complète | moins de 15 min |
| Perte de données maximale (RPO) | 24 h |
| Budget par étudiant | moins de 25 USD |


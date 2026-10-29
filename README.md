# aws-3tier-infra

# aws-3tier-infra

Infrastructure AWS 3 tiers en Terraform pour l'application StockFlow
(React, Express, PostgreSQL), région us-east-1.

**Membres :** Majdeddine Mohamed / Oussema Rhim

## Application
StockFlow (source : github.com/rwxvishali/stockflow-inventory), voir `app/SOURCE.md`.

## Prérequis
Terraform >= 1.5, AWS CLI, Learner Lab démarré.

## Identifiants 
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
export AWS_SESSION_TOKEN=...
export AWS_DEFAULT_REGION=us-east-1

## Construire l'infrastructure
./scripts/apply.sh

## Détruire l'infrastructure (obligatoire en fin de séance)
./scripts/destroy.sh <prefixe>

## Structure
infra/ (Terraform) · app/ (code applicatif) · scripts/ · docs/

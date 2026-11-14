
# aws-3tier-infra

Infrastructure AWS 3 tiers en Terraform pour l'application StockFlow
(React, Express, PostgreSQL), région us-east-1.


## Application
StockFlow (source : github.com/rwxvishali/stockflow-inventory)

## Prérequis
Terraform >= 1.5, AWS CLI
## Identifiants 
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_SESSION_TOKEN
AWS_DEFAULT_REGION

## Construire l'infrastructure
./scripts/apply.sh

## Détruire l'infrastructure 
./scripts/destroy.sh <prefixe>

## Structure
infra/ (Terraform) · app/ (code applicatif) · scripts/ · docs/

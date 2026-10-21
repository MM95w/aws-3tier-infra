#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../infra"
terraform init -input=false
terraform apply -auto-approve -var-file=envs/dev.tfvars
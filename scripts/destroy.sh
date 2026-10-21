#!/usr/bin/env bash
set -euo pipefail
PREFIX="${1:?Usage: $0 <prefixe-groupe>}"
cd "$(dirname "$0")/../infra"
terraform destroy -auto-approve -var-file=envs/dev.tfvars
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) | destroy | $(git config user.name)" >> ../docs/journal-destructions.md
echo "--- Instances restantes ---"
aws ec2 describe-instances --region us-east-1 \
  --filters "Name=tag:Project,Values=$PREFIX" "Name=instance-state-name,Values=pending,running,stopping,stopped" \
  --query 'Reservations[].Instances[].InstanceId' --output text
#!/bin/bash
dnf install -y nginx
TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 300")
IID=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/instance-id)
AZ=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/placement/availability-zone)
EGRESS=$(curl -s --max-time 10 https://checkip.amazonaws.com)
echo "EGRESS_IP=$EGRESS" > /dev/console
cat > /usr/share/nginx/html/index.html <<HTML
<h1>${prefix}</h1>
<p>Instance : $IID</p>
<p>Zone : $AZ</p>
<p>IP sortante (NAT) : $EGRESS</p>
HTML
systemctl enable --now nginx
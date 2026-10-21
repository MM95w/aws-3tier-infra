#!/bin/bash
dnf install -y iptables-services
echo "net.ipv4.ip_forward=1" > /etc/sysctl.d/90-nat.conf
sysctl -p /etc/sysctl.d/90-nat.conf
systemctl enable --now iptables
IFACE=$(ip route show default | awk '{print $5}' | head -1)
iptables -t nat -A POSTROUTING -o $IFACE -j MASQUERADE
iptables -F FORWARD
service iptables save
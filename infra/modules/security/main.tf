# --- ALB ---
resource "aws_security_group" "alb" {
  name        = "${var.prefix}-sg-alb"
  description = "ALB : HTTP depuis Internet"
  vpc_id      = var.vpc_id
  tags        = { Name = "${var.prefix}-sg-alb" }
}
resource "aws_vpc_security_group_ingress_rule" "alb_http" {
  security_group_id = aws_security_group.alb.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "tcp"
  from_port         = 80
  to_port           = 80
}
resource "aws_vpc_security_group_egress_rule" "alb_all" {
  security_group_id = aws_security_group.alb.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}

# --- Applicatif ---
resource "aws_security_group" "app" {
  name        = "${var.prefix}-sg-app"
  description = "App : HTTP depuis ALB uniquement"
  vpc_id      = var.vpc_id
  tags        = { Name = "${var.prefix}-sg-app" }
}
resource "aws_vpc_security_group_ingress_rule" "app_from_alb" {
  security_group_id            = aws_security_group.app.id
  referenced_security_group_id = aws_security_group.alb.id
  ip_protocol                  = "tcp"
  from_port                    = 80
  to_port                      = 80
}
resource "aws_vpc_security_group_egress_rule" "app_all" {
  security_group_id = aws_security_group.app.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}

# --- Base de données (sans règle de sortie) ---
resource "aws_security_group" "db" {
  name        = "${var.prefix}-sg-db"
  description = "DB : MySQL depuis la couche applicative uniquement"
  vpc_id      = var.vpc_id
  tags        = { Name = "${var.prefix}-sg-db" }
}
resource "aws_vpc_security_group_ingress_rule" "db_from_app" {
  security_group_id            = aws_security_group.db.id
  referenced_security_group_id = aws_security_group.app.id
  ip_protocol                  = "tcp"
  from_port                    = 3306
  to_port                      = 3306
}

# --- NAT (utilisé par le module de B) ---
resource "aws_security_group" "nat" {
  name        = "${var.prefix}-sg-nat"
  description = "NAT : trafic depuis les sous-reseaux applicatifs"
  vpc_id      = var.vpc_id
  tags        = { Name = "${var.prefix}-sg-nat" }
}
resource "aws_vpc_security_group_ingress_rule" "nat_from_app" {
  count             = length(var.private_app_cidrs)
  security_group_id = aws_security_group.nat.id
  cidr_ipv4         = var.private_app_cidrs[count.index]
  ip_protocol       = "-1"
}
resource "aws_vpc_security_group_egress_rule" "nat_all" {
  security_group_id = aws_security_group.nat.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}
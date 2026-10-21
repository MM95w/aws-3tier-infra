data "aws_availability_zones" "ok" { state = "available" }
locals { azs = slice(data.aws_availability_zones.ok.names, 0, 2) }

module "network" {
  source   = "./modules/network"
  prefix   = var.prefix
  vpc_cidr = var.vpc_cidr
  azs      = local.azs
}

module "security" {
  source            = "./modules/security"
  prefix            = var.prefix
  vpc_id            = module.network.vpc_id
  private_app_cidrs = module.network.private_app_cidrs
}

module "nat" {
  source                  = "./modules/nat"
  prefix                  = var.prefix
  instance_type           = var.instance_type
  subnet_id               = module.network.public_subnet_ids[0]
  security_group_id       = module.security.nat_sg_id
  private_app_route_table = module.network.private_app_route_table_id
}

module "compute" {
  source            = "./modules/compute"
  prefix            = var.prefix
  instance_type     = var.instance_type
  instance_count    = var.app_instance_count
  subnet_ids        = module.network.private_app_subnet_ids
  security_group_id = module.security.app_sg_id
  instance_profile  = "LabInstanceProfile"
  depends_on        = [module.nat]
}
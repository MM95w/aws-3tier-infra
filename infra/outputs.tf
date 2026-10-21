output "nat_public_ip" { value = module.nat.public_ip }
output "app_instance_ids" { value = module.compute.instance_ids }
output "app_private_ips" { value = module.compute.private_ips }
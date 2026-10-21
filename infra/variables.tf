variable "region"      { default = "us-east-1" }
variable "prefix"      { type = string }
variable "environment" { default = "dev" }
variable "vpc_cidr"    { default = "10.0.0.0/16" }
variable "instance_type" { default = "t3.micro" }
variable "app_instance_count" { default = 1 }
data "aws_ami" "al2023" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["al2023-ami-2023*-x86_64"]
  }
  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
}

resource "aws_instance" "app" {
  count                  = var.instance_count
  ami                    = data.aws_ami.al2023.id
  instance_type          = var.instance_type
  subnet_id              = element(var.subnet_ids, count.index)
  vpc_security_group_ids = [var.security_group_id]
  iam_instance_profile   = var.instance_profile

  user_data                   = templatefile("${path.module}/user_data.sh.tpl", { prefix = var.prefix })
  user_data_replace_on_change = true

  metadata_options { http_tokens = "required" }
  tags = { Name = "${var.prefix}-app-${count.index + 1}", Tier = "app" }
}
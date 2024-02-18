resource "aws_security_group" "bastion_host_sg" {
  name        = "${local.prefix}-bastion-host-sg"
  description = "Allow SSH into bastion host instance"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "TCP"
    cidr_blocks = [var.bastion_host_cidr]
    description = "SSH from bastion host"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.global_destination_cidr_block]
  }

  tags = merge(
    local.common_tags,
    tomap({ "Name" = "${local.prefix}-bastion-host-sg" })
  )
}


resource "aws_security_group" "alb_sg" {
  name        = "${local.prefix}-alb-sg"
  description = "Allow HTTP and HTTPS traffic to ALB"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "TCP"
    cidr_blocks = [var.global_destination_cidr_block]
    description = "HTTP from anywhere"
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "TCP"
    cidr_blocks = [var.global_destination_cidr_block]
    description = "HTTPS from anywhere"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.global_destination_cidr_block]
  }

  tags = merge(
    local.common_tags,
    tomap({ "Name" = "${local.prefix}-alb-sg" })
  )
}


resource "aws_security_group" "autoscaling_group_sg" {
  name        = "${local.prefix}-autoscaling-group-sg"
  description = "Allow traffic to autoscaling group instances"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "TCP"
    security_groups = [aws_security_group.alb_sg.id]
    description     = "Allows HTTP traffic into web servers"
  }

  ingress {
    from_port       = 443
    to_port         = 443
    protocol        = "TCP"
    security_groups = [aws_security_group.alb_sg.id]
    description     = "Allows HTTPS traffic into web servers"
  }

  ingress {
    from_port       = 22
    to_port         = 22
    protocol        = "TCP"
    security_groups = [aws_security_group.bastion_host_sg.id]
    description     = "Allows Access to web servers from bastion host"
  }

  ingress {
    from_port       = 5000
    to_port         = 5000
    protocol        = "TCP"
    security_groups = [aws_security_group.alb_sg.id]
    description     = "Allows traffic to the API server"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.global_destination_cidr_block]
  }

  tags = merge(
    local.common_tags,
    tomap({ "Name" = "${local.prefix}-autoscaling-group-sg" })
  )
}



resource "aws_security_group" "elasticache_sg" {
  name        = "${local.prefix}-elasticache-sg"
  description = "Allows access to elasticache service"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "TCP"
    security_groups = [aws_security_group.bastion_host_sg.id]
    description     = "Allows access to elasticache from bastion host"
  }

  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "TCP"
    security_groups = [aws_security_group.autoscaling_group_sg.id]
    description     = "Allows access to elasticache from web servers"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.global_destination_cidr_block]
  }

  tags = merge(
    local.common_tags,
    tomap({ "Name" = "${local.prefix}-elasticache-sg" })
  )
}

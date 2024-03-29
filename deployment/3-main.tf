terraform {
  backend "s3" {
    bucket  = "inkteract-app-terraform-state"
    key     = "production/chatapp.tfstate"
    region  = "eu-central-1"
    encrypt = true
  }
}

locals {
  prefix = "${var.prefix}-${terraform.workspace}"

  common_tags = {
    Environment = terraform.workspace
    Project     = var.project
    ManagedBy   = "Terraform"
    Owner       = "Inkteract"
  }
}
# get the hosted zone id for the domain
data "aws_route53_zone" "main" {
  name         = var.main_api_server_domain
  private_zone = false
}

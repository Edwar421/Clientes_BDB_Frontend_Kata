variable "aws_region" {
  description = "AWS region where the Terraform state bucket lives"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Base project name used for resource naming"
  type        = string
  default     = "gestion-clientes-bdb"
}

variable "environment" {
  description = "Environment name (qa, prod)"
  type        = string

  validation {
    condition     = contains(["qa", "prod"], var.environment)
    error_message = "environment must be one of: qa, prod."
  }
}

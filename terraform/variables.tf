variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "gestion-clientes-bdb"
}

variable "environment" {
  description = "Environment name (qa, prod-761112472408)"
  type        = string

  validation {
    condition     = contains(["qa", "prod-761112472408"], var.environment)
    error_message = "environment must be one of: qa, prod-761112472408."
  }
}

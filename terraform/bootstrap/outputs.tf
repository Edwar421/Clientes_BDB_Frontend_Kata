output "state_bucket_name" {
  description = "Name of the S3 bucket holding the Terraform state for this environment"
  value       = aws_s3_bucket.terraform_state.id
}

output "backend_config" {
  description = "Values to pass to `terraform init -backend-config` in the root config"
  value = {
    bucket = aws_s3_bucket.terraform_state.id
    key    = "${var.environment}/terraform.tfstate"
    region = var.aws_region
  }
}

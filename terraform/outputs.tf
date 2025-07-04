output "cluster_name" {
  description = "Name of the GKE cluster"
  value       = google_container_cluster.bankme_cluster.name
}

output "cluster_location" {
  description = "Location of the GKE cluster"
  value       = google_container_cluster.bankme_cluster.location
}

output "artifact_registry_repository" {
  description = "Artifact Registry repository name"
  value       = google_artifact_registry_repository.bankme_images.name
}

output "artifact_registry_location" {
  description = "Artifact Registry repository location"
  value       = google_artifact_registry_repository.bankme_images.location
}

output "database_instance_name" {
  description = "Name of the Cloud SQL instance"
  value       = google_sql_database_instance.bankme_database.name
}

output "database_name" {
  description = "Name of the database"
  value       = google_sql_database.bankme_db.name
}

output "database_connection_name" {
  description = "Connection name for the Cloud SQL instance"
  value       = google_sql_database_instance.bankme_database.connection_name
}

output "github_actions_service_account_email" {
  description = "Email of the GitHub Actions service account"
  value       = google_service_account.github_actions_sa.email
}

output "github_actions_service_account_key" {
  description = "Service account key for GitHub Actions (base64 encoded)"
  value       = base64decode(google_service_account_key.github_actions_key.private_key)
  sensitive   = true
}

output "vpc_name" {
  description = "Name of the VPC network"
  value       = google_compute_network.bankme_vpc.name
}

output "subnet_name" {
  description = "Name of the subnet"
  value       = google_compute_subnetwork.bankme_subnet.name
}

output "redis_host" {
  description = "Host of the Redis instance"
  value       = google_redis_instance.bankme_redis.host
}

output "redis_port" {
  description = "Port of the Redis instance"
  value       = google_redis_instance.bankme_redis.port
}

output "redis_current_location_id" {
  description = "Current location ID of the Redis instance"
  value       = google_redis_instance.bankme_redis.current_location_id
} 
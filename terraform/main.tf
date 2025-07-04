terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
  }

  backend "gcs" {
    bucket = "bankme-terraform-state"
    prefix = "terraform/state"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

# Enable required APIs
resource "google_project_service" "required_apis" {
  for_each = toset([
    "container.googleapis.com",
    "artifactregistry.googleapis.com",
    "cloudbuild.googleapis.com",
    "compute.googleapis.com",
    "iam.googleapis.com",
    "redis.googleapis.com"
  ])

  project = var.project_id
  service = each.value

  disable_dependent_services = true
  disable_on_destroy         = false
}

# Create Artifact Registry repository
resource "google_artifact_registry_repository" "bankme_images" {
  location      = var.region
  repository_id = var.artifact_registry_name
  description   = "Docker images for BankMe application"
  format        = "DOCKER"

  depends_on = [google_project_service.required_apis]
}

# Create GKE cluster
resource "google_container_cluster" "bankme_cluster" {
  name     = var.cluster_name
  location = var.region

  # Remove default node pool
  remove_default_node_pool = true
  initial_node_count       = 1

  network    = google_compute_network.bankme_vpc.name
  subnetwork = google_compute_subnetwork.bankme_subnet.name

  # Enable Workload Identity
  workload_pool_config {
    workload_pool = "${var.project_id}.svc.id.goog"
  }

  # Enable Autopilot
  enable_autopilot = true

  # Private cluster configuration
  private_cluster_config {
    enable_private_nodes    = true
    enable_private_endpoint = false
    master_ipv4_cidr_block  = "172.16.0.0/28"
  }

  # Master authorized networks
  master_authorized_networks_config {
    cidr_blocks {
      cidr_block   = "0.0.0.0/0"
      display_name = "All"
    }
  }

  depends_on = [google_project_service.required_apis]
}

# Create node pool for the cluster
resource "google_container_node_pool" "bankme_node_pool" {
  name       = "bankme-node-pool"
  location   = var.region
  cluster    = google_container_cluster.bankme_cluster.name
  node_count = var.node_count

  node_config {
    oauth_scopes = [
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
      "https://www.googleapis.com/auth/cloud-platform"
    ]

    labels = {
      env = var.environment
    }

    machine_type = var.machine_type
    disk_size_gb = 100

    metadata = {
      disable-legacy-endpoints = "true"
    }

    tags = ["gke-node", "bankme-node"]
  }

  depends_on = [google_container_cluster.bankme_cluster]
}

# Create VPC network
resource "google_compute_network" "bankme_vpc" {
  name                    = "bankme-vpc"
  auto_create_subnetworks = false
}

# Create subnet
resource "google_compute_subnetwork" "bankme_subnet" {
  name          = "bankme-subnet"
  ip_cidr_range = "10.0.0.0/24"
  region        = var.region
  network       = google_compute_network.bankme_vpc.name

  # Enable flow logs
  log_config {
    aggregation_interval = "INTERVAL_5_SEC"
    flow_sampling       = 0.5
    metadata           = "INCLUDE_ALL_METADATA"
  }
}

# Create Cloud SQL instance for PostgreSQL
resource "google_sql_database_instance" "bankme_database" {
  name             = "bankme-database"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier = var.database_tier

    backup_configuration {
      enabled    = true
      start_time = "02:00"
    }

    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.bankme_vpc.id
    }
  }

  deletion_protection = false

  depends_on = [google_project_service.required_apis]
}

# Create Redis instance
resource "google_redis_instance" "bankme_redis" {
  name           = "bankme-redis"
  tier           = var.redis_tier
  memory_size_gb = var.redis_memory_size_gb
  region         = var.region

  authorized_network = google_compute_network.bankme_vpc.id

  redis_version = "REDIS_7_0"
  display_name  = "BankMe Redis Instance"

  maintenance_policy {
    weekly_maintenance_window {
      day = "SUNDAY"
      start_time {
        hours   = 2
        minutes = 0
      }
    }
  }

  depends_on = [google_project_service.required_apis]
}

# Create database
resource "google_sql_database" "bankme_db" {
  name     = "bankme"
  instance = google_sql_database_instance.bankme_database.name
}

# Create database user
resource "google_sql_user" "bankme_user" {
  name     = "bankme_user"
  instance = google_sql_database_instance.bankme_database.name
  password = var.database_password
}

# Create service account for GKE
resource "google_service_account" "gke_service_account" {
  account_id   = "bankme-gke-sa"
  display_name = "Service Account for BankMe GKE"
}

# Grant necessary roles to the service account
resource "google_project_iam_member" "gke_service_account_roles" {
  for_each = toset([
    "roles/container.developer",
    "roles/storage.objectViewer",
    "roles/logging.logWriter",
    "roles/monitoring.metricWriter"
  ])

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.gke_service_account.email}"
}

# Create service account for GitHub Actions
resource "google_service_account" "github_actions_sa" {
  account_id   = "bankme-github-actions"
  display_name = "Service Account for GitHub Actions"
}

# Grant necessary roles to GitHub Actions service account
resource "google_project_iam_member" "github_actions_roles" {
  for_each = toset([
    "roles/artifactregistry.writer",
    "roles/container.developer",
    "roles/storage.objectViewer"
  ])

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.github_actions_sa.email}"
}

# Create service account key for GitHub Actions
resource "google_service_account_key" "github_actions_key" {
  service_account_id = google_service_account.github_actions_sa.name
  public_key_type    = "TYPE_X509_PEM_FILE"
} 
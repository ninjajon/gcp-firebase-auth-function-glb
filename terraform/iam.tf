resource "google_service_account" "runsa" {
  account_id   = "function-run-sa"
  display_name = "Function Run Service Account"
    project = var.project
}

resource "google_project_iam_member" "runsa_role1" {
  project = var.project
  role    = "roles/storage.objectViewer"
  member  = "serviceAccount:${google_service_account.runsa.email}"
}

resource "google_service_account" "deploysa" {
  account_id   = "function-deploy-sa"
  display_name = "Function Deploy Service Account"
  project      = var.project
}

resource "google_project_iam_member" "deploysa_role1" {
  project = var.project
  role    = "roles/cloudfunctions.admin"
  member  = "serviceAccount:${google_service_account.deploysa.email}"
}

resource "google_project_iam_member" "deploysa_role2" {
  project = var.project
  role    = "roles/firebase.developAdmin"
  member  = "serviceAccount:${google_service_account.deploysa.email}"
}

resource "google_service_account_iam_binding" "deploysa_actas_run" {
  service_account_id = google_service_account.runsa.name
  role               = "roles/iam.serviceAccountUser"
  members = [
    "serviceAccount:${google_service_account.deploysa.email}"
  ]
}

# resource "google_service_account" "buildsa" {
#   account_id   = "function-build-sa"
#   display_name = "Function Build Service Account"
#   project      = var.project
# }

# resource "google_project_iam_member" "buildsa_role1" {
#   project = var.project
#   role    = "roles/logging.logWriter"
#   member  = "serviceAccount:${google_service_account.buildsa.email}"
# }

# resource "google_project_iam_member" "buildsa_role2" {
#   project = var.project
#   role    = "roles/artifactregistry.writer"
#   member  = "serviceAccount:${google_service_account.buildsa.email}"
# }



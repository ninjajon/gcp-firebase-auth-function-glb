# VPC in the cloud
module "neg_northamerica_northeast1" {
  source = "./modules/neg"
  providers = {
    google = google.target
  }
  prefix        = var.prefix
  region        = "northamerica-northeast1"
  function_name = "app"
}

module "neg_us_central1" {
  source = "./modules/neg"
  providers = {
    google = google.target
  }
  prefix        = var.prefix
  region        = "us-central1"
  function_name = "app"
}

module "glb" {
  source = "./modules/glb"
  providers = {
    google = google.target
  }
  prefix             = var.prefix
  neg1_id            = module.neg_us_central1.neg_id
  neg2_id            = module.neg_northamerica_northeast1.neg_id
  domain_name        = var.domain_name
  project            = var.project
  central_project_id = var.central_project_id
  zone_name          = var.zone_name
}

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.45.0"
    }
  }

  backend "gcs" {
    bucket = "jo-terraform-states"
    prefix = "firebase-lb"
  }
}

provider "google" {
  project = "jo-shared-services-lzzo"
  region  = "us-central1"
}

provider "google" {
  alias   = "target"
  project = "jo-firebase-auth-fct-glb-jxba"
  region  = "us-central1"
}

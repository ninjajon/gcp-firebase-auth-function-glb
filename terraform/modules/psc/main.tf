resource "google_compute_address" "psc_ilb_consumer_address" {
  name         = "${var.prefix}-psc-ip-${var.region}"
  region       = var.region
  subnetwork   = var.subnet_name
  address_type = "INTERNAL"
}

resource "google_compute_forwarding_rule" "psc_ilb_consumer" {
  name   = "${var.prefix}-psc-fwd-rule-${var.region}"
  region = var.region

  target                = var.service_attachment_id
  load_balancing_scheme = "" # need to override EXTERNAL default when target is a service attachment
  network               = var.network
  ip_address            = google_compute_address.psc_ilb_consumer_address.id
}

resource "google_compute_region_network_endpoint_group" "psc_neg" {
  name                  = "${var.prefix}-psc-neg-${var.region}"
  region                = var.region
  network_endpoint_type = "PRIVATE_SERVICE_CONNECT"
  psc_target_service    = var.service_attachment_id
  network               = var.network
  subnetwork            = var.subnet_name
}

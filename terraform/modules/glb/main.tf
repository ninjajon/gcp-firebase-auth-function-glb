resource "google_compute_backend_service" "default" {
  load_balancing_scheme = "EXTERNAL_MANAGED"
  name                  = "${var.prefix}-be"
  enable_cdn            = true
  protocol              = "HTTPS"

  backend {
    group = var.neg1_id
  }

  backend {
    group = var.neg2_id
  }

  log_config {
    enable      = true
    sample_rate = 1.0
  }
}

# global ip
resource "google_compute_global_address" "default" {
  name = "${var.prefix}-ip"
}

resource "google_compute_managed_ssl_certificate" "lb_default" {
  name = "${var.prefix}-cert"

  managed {
    domains = [var.domain_name]
  }
}

# url map
resource "google_compute_url_map" "default" {
  name            = "${var.prefix}-url-map"
  default_service = google_compute_backend_service.default.id
}

# http proxy
resource "google_compute_target_https_proxy" "default" {
  name    = "${var.prefix}-proxy"
  url_map = google_compute_url_map.default.id
  ssl_certificates = [
    google_compute_managed_ssl_certificate.lb_default.name
  ]
}

# forwarding rule
resource "google_compute_global_forwarding_rule" "default" {
  name                  = "${var.prefix}-fwd-rule"
  ip_protocol           = "TCP"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  port_range            = "443"
  target                = google_compute_target_https_proxy.default.id
  ip_address            = google_compute_global_address.default.id
}

# create dns A record
resource "google_dns_record_set" "a_record" {
  project      = var.central_project_id
  managed_zone = var.zone_name
  name         = "${var.domain_name}."
  type         = "A"
  rrdatas      = [google_compute_global_address.default.address]
  ttl          = 300
}

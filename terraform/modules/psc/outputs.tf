output "psc_name" {
    value = google_compute_forwarding_rule.psc_ilb_consumer.name
}

output "psc_id" {
    value = google_compute_forwarding_rule.psc_ilb_consumer.id
}

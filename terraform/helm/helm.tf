provider "helm" {
  kubernetes {
    host = data.terraform_remote_state.gke.outputs.kubernetes_cluster_host

    token                  = data.google_client_config.default.access_token
    cluster_ca_certificate = base64decode(data.google_container_cluster.my_cluster.master_auth[0].cluster_ca_certificate)
  }
}


resource "helm_release" "cert_manager" {
  name       = "my-cert-manager-release"
  repository = "https://charts.jetstack.io"
  chart      = "cert-manager"
  version    = "1.6.1"
  namespace = "cert-manager"
  create_namespace = true

  set {
    name  = "global.leaderElection.namespace"
    value = "cert-manager"
  }

  set {
    name  = "installCRDs"
    value = "true"
  }

  set {
    name  = "prometheus.enabled"
    value = "false"
  }
}
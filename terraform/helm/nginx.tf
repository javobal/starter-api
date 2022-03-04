resource "kubernetes_cluster_role_binding_v1" "cluster-admin-binding" {
  metadata {
    name = "cluster-admin-binding"
  }
  role_ref {
    api_group = "rbac.authorization.k8s.io"
    kind      = "ClusterRole"
    name      = "cluster-admin"
  }
  subject {
    kind      = "User"
    name      = "javier.balam@gmail.com"
    api_group = "rbac.authorization.k8s.io"
  }
}


resource "helm_release" "ingress-nginx" {
  name             = "my-ingress-nginx-release"
  repository       = "https://kubernetes.github.io/ingress-nginx"
  chart            = "ingress-nginx"
  version          = "4.0.9"
  namespace        = "ingress-nginx"
  create_namespace = true
}

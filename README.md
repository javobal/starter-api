# API Starter Project

-   Node v14
-   Typescript
-   Yarn
-   Express

#### Arquitecture

The application is divided in database layer (Model), Business logic layer (Services) and API layer (Router)

#### Services

#### Model

Firebase firestore it is as persistence layer

#### Router
Express provides the base for all routing

#### Deployment
* Github Actions -> Docker image to GCR -> Deployment to GKE

Important using Kustomize 4.4.0, do not use kubectl -k option, kubectl's emmbeded kustomize is out of date and mixing kustomize versions could cause problems. use the same version in github actions and in your dev computer

### GKE config
* cert-manager
* nginx-controller
* kubectl v1.21 Rapid channel (needed to support cert-manager)


### initial GKE provisioning
At some point automate this process with ansible ?

1.Install cert-manager
2.install nginx controller
3.create cluster issuer
4.run github actions or deploy from local kubectl using kustomize without tls configs. otherwise the load balancer won't be provisioned and cert manager cant verify the endpoint, it needs the http to create the certificate.
5.apply tls configs

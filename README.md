# API Starter Project

-   Node v14
-   Typescript
-   Yarn
-   Express

### Arquitecture

The application is divided in database layer (Model), Business logic layer (Services) and API layer (Router)

#### Services

#### Model

Firebase firestore it is as persistence layer

#### Router
Express provides the base for all routing

### Deployment
* Github Actions -> Docker image to GCR -> Deployment to GKE

Important using Kustomize 4.4.0, do not use kubectl -k option, kubectl's emmbeded kustomize is out of date and mixing kustomize versions could cause problems. use the same version in github actions and in your dev computer

### GKE config
* cert-manager
* nginx-controller
* kubectl > v1.21 (needed to support cert-manager)

### Initial GKE provisioning
At some point automate this process with ansible ?

Costs:
* Load Balancer
* GKE management fee and resources costs
* optional static ip

Remember to configure cert manager and nginx controller so they do not use the default 1 vcpu and 512 MiB which is overkill
#### Load balancer tier
Change the premium tier or std tier, around 350MX for the premium tier cloud load balancer
because of the way we have setup nginx controller it is using a single load balancer for our cluster
https://console.cloud.google.com/net-tier/tiers/details?project=javobalapp

OR add this annotation to the nginx controller service : cloud.google.com/network-tier: Standard

1. Install cert-manager
2. install nginx controller
3. add tier annotation for nginx service
3. create cluster issuer
4. run github actions or deploy from local kubectl using kustomize without tls configs. otherwise the load balancer won't be provisioned and cert manager cant verify the endpoint, it needs the http to create the certificate.
5. apply tls configs


### GKE Costs discussion

* GKE Standard with g1-small
  * 3 x 1 vCPU @ 13.1 USD/month = ~ 40 USD/month
* GKE Autopilot
  * 1 x 1 vCPU @ 32 USD/month = ~ 32 USD/month
* Cluster management fee is .10/hr per cluster, that is 74.4 usd/month. Free tier includes 1 cluster

#### Observations
* In STD around 1.2 vCPU is already requested for system pods (in my test 520 mCPU / 468 mCPU / 480 mCPU), means 1.8 vCPU are available (not sure because of g1-small rules)
* STD allows smaller .1 vCPU increments, Auto minimum pod vCPU is .25
* On demand prices considered, chepaer prices if commited for a year
* on e2-micro is in the free tier

#### Conclusions
* Std allows for smaller vCPU requests increments so you can fit more pods in a single node, if the apps are small
* for this starter api template 
  * Autopilot: 0.25 vCPU x 6 pods = 1.5 vCPU @ 32 USD/month = ~48 USD/month
  * Std: g1-small 3 nodes cluster = ~40 USD/month (includes sustained disccount)

#### Refs
* https://cloud.google.com/kubernetes-engine/pricing
* https://cloud.google.com/compute/all-pricing#sharedcore
* https://cloud.google.com/compute/vm-instance-pricing#sustained_use
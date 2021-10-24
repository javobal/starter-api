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

### GKE config
* cert-manager
* nginx-controller
* kubectl v1.20

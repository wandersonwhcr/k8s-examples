# cert-manager

This example shows how to install `cert-manager` and how to create a Self Signed
Root Certificate Authority. Also, this example generates a certificate from Root
CA and installs it on Nginx, using a client to make HTTP requests to this web
server via cURL.

```console
k3d cluster create \
    --config ../k3d-example.yaml

kubectl apply \
    --filename https://github.com/cert-manager/cert-manager/releases/download/v1.8.2/cert-manager.yaml

kubectl apply \
    --kustomize .
```

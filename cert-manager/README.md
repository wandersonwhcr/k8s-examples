# cert-manager

This example shows how to install `cert-manager` and how to create a Self Signed
Root Certificate Authority. Also, this example generates a certificate from Root
CA and installs it on Nginx, using a client to make HTTP requests to this web
server via cURL.

Traefik is configured to talk with backend via HTTPS using a servers transport.

```
k3d cluster create \
    --config ../k3d-example.yaml

kubectl apply \
    --filename https://github.com/cert-manager/cert-manager/releases/download/v1.8.2/cert-manager.yaml

kubectl apply \
    --kustomize .
```

```console
$ kubectl logs --follow deployment/crawler
Thu Jul  7 00:51:07 UTC 2022
{"hostname": "nginx-9474bc8c9-pqnfx"} nginx
{"hostname": "nginx-9474bc8c9-ld7gd"} nginx.example
{"hostname": "nginx-9474bc8c9-cj2f4"} nginx.example.svc.cluster.local
Thu Jul  7 00:51:12 UTC 2022
{"hostname": "nginx-9474bc8c9-ld7gd"} nginx
{"hostname": "nginx-9474bc8c9-cj2f4"} nginx.example
{"hostname": "nginx-9474bc8c9-cj2f4"} nginx.example.svc.cluster.local
Thu Jul  7 00:51:17 UTC 2022
{"hostname": "nginx-9474bc8c9-pqnfx"} nginx
{"hostname": "nginx-9474bc8c9-cj2f4"} nginx.example
{"hostname": "nginx-9474bc8c9-cj2f4"} nginx.example.svc.cluster.local
```

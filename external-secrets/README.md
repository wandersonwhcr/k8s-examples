# external-secrets

```
k3d cluster create example \
    --servers 1 \
    --agents 1 \
    --no-lb

helm repo add external-secrets https://charts.external-secrets.io
helm repo update

helm install external-secrets external-secrets/external-secrets \
    --namespace external-secrets \
    --create-namespace \
    --set installCRDs=true

kubectl apply \
    --kustomize my-secrets-store

kubectl apply \
    --kustomize .

kubectl logs \
    deployments/example \
    --namespace example
```

```
ANOTHER_SUPER_SERVICE_HOST=another.super.svc
ANOTHER_SUPER_SERVICE_PASSWORD=robin
ANOTHER_SUPER_SERVICE_USERNAME=batman
HOME=/root
HOSTNAME=example-77487c9bdb-nt9pp
KUBERNETES_PORT=tcp://10.43.0.1:443
KUBERNETES_PORT_443_TCP=tcp://10.43.0.1:443
KUBERNETES_PORT_443_TCP_ADDR=10.43.0.1
KUBERNETES_PORT_443_TCP_PORT=443
KUBERNETES_PORT_443_TCP_PROTO=tcp
KUBERNETES_SERVICE_HOST=10.43.0.1
KUBERNETES_SERVICE_PORT=443
KUBERNETES_SERVICE_PORT_HTTPS=443
MY_AWESOME_SERVICE_HOST=my.awesome.svc
MY_AWESOME_SERVICE_TOKEN=this-is-confidential
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
PWD=/
SHLVL=1
```

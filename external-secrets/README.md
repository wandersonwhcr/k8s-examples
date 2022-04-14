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
```

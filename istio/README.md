# istio

```
k3d cluster create \
    --config ../k3d-example.yaml \
    --agents-memory 2G \
    --k3s-arg --no-deploy=traefik@server:*

istioctl install \
    --skip-confirmation

kubectl apply \
    --filename ingressclass.yaml
```

```
kubectl apply \
    --kustomize ./app-example
```

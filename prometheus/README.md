# prometheus

```
k3d cluster create \
    --config ../k3d-example.yaml

kubectl create \
    --kustomize ./prometheus-operator

kubectl apply \
    --kustomize .

kubectl apply \
    --kustomize app-example
```

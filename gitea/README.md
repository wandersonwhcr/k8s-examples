# gitea

```
k3d cluster create \
    --config ../k3d-example.yaml

helm dependency build

helm install gitea . \
    --namespace gitea \
    --create-namespace
```

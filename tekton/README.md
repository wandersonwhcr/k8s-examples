# tekton

```
k3d cluster create \
    --config ../k3d-example.yaml
```

```
helm dependency build ../gitea

helm install gitea ../gitea \
    --namespace gitea \
    --create-namespace
```

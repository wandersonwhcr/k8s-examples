# gitea

```
k3d cluster create \
    --config ../k3d-example.yaml

helm dependency build

helm install gitea . \
    --namespace gitea \
    --create-namespace

kubectl rollout status statefulset/gitea \
    --namespace gitea \
    --timeout 600s

kubectl port-forward service/gitea-http 3000 \
    --namespace gitea
```

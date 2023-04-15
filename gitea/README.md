# gitea

```
k3d cluster create \
    --config ../k3d-example.yaml

kubectl apply \
    --kustomize ./gitea

helm repo add gitea-charts https://dl.gitea.io/charts/
helm repo update

helm install gitea gitea-charts/gitea \
    --namespace gitea \
    --values ./gitea/values.yaml

kubectl rollout status statefulset/gitea \
    --namespace gitea \
    --timeout 600s

kubectl port-forward \
    service/gitea-http 3000 \
    --namespace gitea
```

# argocd

```
k3d cluster create \
    --config ../k3d-example.yaml

kubectl apply \
    --kustomize ./

```
# Username: admin
# Password
kubectl get secrets argocd-initial-admin-secret \
    --namespace argocd \
    --output 'jsonpath={.data.password}' \
    | base64 --decode
```

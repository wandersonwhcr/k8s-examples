# argocd

```
k3d cluster create \
    --config ../k3d-example.yaml

kubectl apply \
    --kustomize ./argocd
```

```
kubectl port-forward service/argocd-server 8443:443 \
    --namespace argocd
```

Argo CD UI will be available [here](https://localhost:8443).

```
# Username: admin
# Password
kubectl get secrets argocd-initial-admin-secret \
    --namespace argocd \
    --output 'jsonpath={.data.password}' \
    | base64 --decode
```

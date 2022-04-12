# prometheus

```
k3d cluster create example \
    --servers 1 \
    --agents 3 \
    --no-lb

kubectl apply \
    --kustomize .

kubectl port-forward service/prometheus 8080:80 \
    --namespace prometheus
```

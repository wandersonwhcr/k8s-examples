# blackbox-exporter

```
k3d cluster create \
    --config ../k3d-example.yaml

kubectl create \
    --kustomize ../prometheus/prometheus-operator

kubectl create \
    --kustomize ../prometheus
```

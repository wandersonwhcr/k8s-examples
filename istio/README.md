# istio

```
k3d cluster create \
    --config ./k3d-example.yaml
```

```
helm upgrade istio-base istio/base \
    --install \
    --version 1.22.5 \
    --namespace istio-system \
    --create-namespace \
    --values ./istio-base/values.yaml
```

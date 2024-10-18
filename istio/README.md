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

```
helm upgrade istiod istio/istiod \
    --install \
    --version 1.22.5 \
    --namespace istio-system \
    --create-namespace \
    --values ./istiod/values.yaml
```

```
helm upgrade istio-ingressgateway istio/gateway \
    --install \
    --version 1.22.5 \
    --namespace istio-ingress \
    --create-namespace \
    --values ./istio-ingressgateway/values.yaml
```

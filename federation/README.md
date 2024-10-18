# federation

```
k3d cluster create \
    --config ./k3d-cluster-0.yaml
```

```
helm install istio-base istio/base \
    --namespace istio-system \
    --create-namespace \
    --version 1.23.2 \
    --kube-context k3d-cluster-0
```

## References

* [Federation](https://en.wikipedia.org/wiki/Federation_(information_technology))

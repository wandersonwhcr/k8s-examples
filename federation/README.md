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

```
helm install istiod istio/istiod \
    --namespace istio-system \
    --version 1.23.2 \
    --values ./cluster-0/istiod/values.yaml \
    --kube-context k3d-cluster-0 \
    --wait
```

```
helm install istio-eastwestgateway istio/gateway \
    --namespace istio-system \
    --version 1.23.2 \
    --values ./cluster-0/istio-eastwestgateway/values.yaml \
    --kube-context k3d-cluster-0 \
    --wait
```

```
k3d cluster create \
    --config ./k3d-cluster-1.yaml
```

## References

* [Federation](https://en.wikipedia.org/wiki/Federation_(information_technology))
* [Istio](https://istio.io/latest/)
* [Istio: Install Multi-Primary on different networks](https://istio.io/latest/docs/setup/install/multicluster/multi-primary_multi-network/)
* [East-west Traffic](https://en.wikipedia.org/wiki/East-west_traffic)

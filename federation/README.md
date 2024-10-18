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

```
helm install istio-base istio/base \
    --namespace istio-system \
    --create-namespace \
    --version 1.23.2 \
    --kube-context k3d-cluster-1
```

```
kubectl get secrets istio-ca-secret \
    --namespace istio-system \
    --output yaml \
    --context k3d-cluster-0 \
    | kubectl create \
        --namespace istio-system \
        --filename - \
        --context k3d-cluster-1
```

```
helm install istiod istio/istiod \
    --namespace istio-system \
    --version 1.23.2 \
    --values ./cluster-1/istiod/values.yaml \
    --kube-context k3d-cluster-1 \
    --wait
```

```
helm install istio-eastwestgateway istio/gateway \
    --namespace istio-system \
    --version 1.23.2 \
    --values ./cluster-1/istio-eastwestgateway/values.yaml \
    --kube-context k3d-cluster-1 \
    --wait
```

```
kubectl apply \
    --filename ./cluster-0/gateway-istio-eastwestgateway.yaml \
    --context k3d-cluster-0
```

```
kubectl apply \
    --filename ./cluster-1/gateway-istio-eastwestgateway.yaml \
    --context k3d-cluster-1
```

```
K3D_CLUSTER_0_SERVER_IP=`
    k3d cluster get cluster-0 --output json \
        | jq '.[].nodes[]' \
        | jq 'select(.role == "server")' \
        | jq '.IP.IP' --raw-output
`

K3D_CLUSTER_1_SERVER_IP=`
    k3d cluster get cluster-1 --output json \
        | jq '.[].nodes[]' \
        | jq 'select(.role == "server")' \
        | jq '.IP.IP' --raw-output
`
```

```
kubectl apply \
    --kustomize ./cluster-0/whoami \
    --context k3d-cluster-0
```

## References

* [Federation](https://en.wikipedia.org/wiki/Federation_(information_technology))
* [Istio](https://istio.io/latest/)
* [Istio: Install Multi-Primary on different networks](https://istio.io/latest/docs/setup/install/multicluster/multi-primary_multi-network/)
* [East-west Traffic](https://en.wikipedia.org/wiki/East-west_traffic)
* [Istio: Plug in CA Certificates](https://istio.io/latest/docs/tasks/security/cert-management/plugin-ca-cert/)

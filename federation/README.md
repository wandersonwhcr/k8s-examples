# federation

This example shows how to create two kubernetes clusters using federation via
Istio multicluster deployment model, where a client running on `cluster-1` can
connect on a server running on `cluster-0` transparently.

## Install Istio

First, create `cluster-0`.

```
k3d cluster create \
    --config ./k3d-cluster-0.yaml
```

After, using Helm, install `istio-base` and `istiod` on `cluster-0`. In this
installation, `istiod` is configured with a multicluster approach, where cluster
is named as `cluster-0`, using mesh `federation-0` and network `network-0`.

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

Next, create `cluster-1`.

```
k3d cluster create \
    --config ./k3d-cluster-1.yaml
```

And, using Helm, install `istio-base` on `cluster-1`.

```
helm install istio-base istio/base \
    --namespace istio-system \
    --create-namespace \
    --version 1.23.2 \
    --kube-context k3d-cluster-1
```

Before installing `istiod` on `cluster-1`, copy `istio-ca-secret` from
`cluster-0` to `cluster-1`, because Istio uses mTLS to transfer data between
clusters.

> [!CAUTION]
> This copy must be used just for demonstration and must not be used on
> production environment.

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

Finally, install `istiod` on `cluster-1`. Also, this `istiod` installation is
configured with a multicluster approach, where cluster is named as `cluster-1`,
using same mesh `federation-0` and different network `network-1`.

```
helm install istiod istio/istiod \
    --namespace istio-system \
    --version 1.23.2 \
    --values ./cluster-1/istiod/values.yaml \
    --kube-context k3d-cluster-1 \
    --wait
```

## Install Istio East-West Gateway

The connection between clusters must be done using `istio-eastwestgateway`.
Clusters `cluster-0` and `cluster-1` must receive a deployment of this resource,
each one with its own network.

```
helm install istio-eastwestgateway istio/gateway \
    --namespace istio-system \
    --version 1.23.2 \
    --values ./cluster-0/istio-eastwestgateway/values.yaml \
    --kube-context k3d-cluster-0 \
    --wait

helm install istio-eastwestgateway istio/gateway \
    --namespace istio-system \
    --version 1.23.2 \
    --values ./cluster-1/istio-eastwestgateway/values.yaml \
    --kube-context k3d-cluster-1 \
    --wait
```

After, expose all services on these gateways in both clusters.

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

## Configure Endpoint Discovery

Each `istiod` must be able to connect on kubernetes API from other cluster. To
accomplish this, create a Istio remote secret from `cluster-0` on `cluster-1`
and vice-versa.

```
istioctl create-remote-secret \
    --name cluster-0 \
    --server 'https://k3d-cluster-0-serverlb:6443' \
    --context k3d-cluster-0 \
    | kubectl apply \
        --filename - \
        --context k3d-cluster-1

istioctl create-remote-secret \
    --name cluster-1 \
    --server 'https://k3d-cluster-1-serverlb:6443' \
    --context k3d-cluster-1 \
    | kubectl apply \
        --filename - \
        --context k3d-cluster-0
```

Check if clusters are _synced_.

```
istioctl remote-clusters \
    --context k3d-cluster-0

istioctl remote-clusters \
    --context k3d-cluster-1
```

```
kubectl apply \
    --kustomize ./cluster-0/whoami \
    --context k3d-cluster-0
```

```
kubectl apply \
    --kustomize ./cluster-1/http-client \
    --context k3d-cluster-1
```

```
kubectl logs \
    --namespace http-client \
    --selector app.kubernetes.io/name=http-client \
    --follow \
    --context k3d-cluster-1
```

## References

* [Federation](https://en.wikipedia.org/wiki/Federation_(information_technology))
* [Istio](https://istio.io/latest/)
* [Istio: Install Multi-Primary on different networks](https://istio.io/latest/docs/setup/install/multicluster/multi-primary_multi-network/)
* [East-west Traffic](https://en.wikipedia.org/wiki/East-west_traffic)
* [Istio: Plug in CA Certificates](https://istio.io/latest/docs/tasks/security/cert-management/plugin-ca-cert/)
* [Traefik: whoami](https://hub.docker.com/r/traefik/whoami)
* [Istio: Verify the installation](https://istio.io/latest/docs/setup/install/multicluster/verify/)

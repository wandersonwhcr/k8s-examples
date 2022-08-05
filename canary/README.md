# canary

This example shows how to create a Canary Release on Kubernetes using Istio.
First, a Kubernetes cluster with Istio installed must be available.

```
k3d cluster create \
    --config ../k3d-example.yaml \
    --k3s-arg --no-deploy=traefik@server:*

istioctl install \
    --skip-confirmation \
    --set profile=demo
```

This example application contains two Deployments: one contains a `stable`
release and another a is the `canary` release, each called a subset of replicas
from application. There is only one Service pointing to both subsets. One
`DestinationRule` must be created to map both subsets and a `VirtualService` to
split traffic using weighted routes. Initially, all traffic directs to `stable`
release.

The `make-requests.sh` script makes 100 requests to example application and
outputs how many responses are from `stable` release or `canary`.

```
kubectl apply \
    --kustomize ./app-example

./make-requests.sh
```

Patch `VirtualService` to redirect 50% of requests to `canary` release. Also,
there is a patch to redirect 100% of requests to `canary`. To redirect all
traffic back to `stable` release, just install example application again.

```
kubectl patch \
    virtualservice app-example \
    --namespace app-example \
    --type json \
    --patch-file patch-canary-50.yaml

./make-requests.sh

kubectl patch \
    virtualservice app-example \
    --namespace app-example \
    --type json \
    --patch-file patch-canary-100.yaml

./make-requests.sh
```

## Notes

This example uses Istio `Gateway` as ingress to route external traffic to
cluster. Default `Ingress` has priority over Istio `Gateway` and if used,
`Ingress` does not use `VirtualService` and does not split weighted traffic, but
uses original `Service` resource from Kubernetes.

Canary works from external and internal traffic because `VirtualService` was
configured using the `mesh` Gateway from Istio.

## References

* [Canary Release by Martin Fowler](https://martinfowler.com/bliki/CanaryRelease.html)

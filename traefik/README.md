# traefik

This example shows how to customize Traefik installed with k3d changing log
level to `DEBUG` and exposing administrative ports.

```
k3d cluster create \
    --config ../k3d-example.yaml

kubectl apply \
    --kustomize .

```

* [Traefik Dashboard](http://traefik.kube-system.svc.cluster.local/dashboard/)

# network-policy

```
k3d cluster create \
    --config ../k3d-example.yaml
```

```
kubectl apply \
    --kustomize ./app-service-a

kubectl apply \
    --kustomize ./app-service-b
```

## Notes

k3s uses Flannel as default container network interface (CNI). Intermittent
request errors appears because ICMP packages are blocked when ports were
defined.

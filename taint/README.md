# taint

```
k3d cluster create \
    --config ../k3d-example.yaml
```

```
kubectl cordon k3d-example-agent-2

kubectl taint node k3d-example-agent-2 foo:bar=NoSchedule

kubectl drain k3d-example-agent-2 \
    --ignore-daemonsets

kubectl uncordon k3d-example-agent-2

kubectl apply \
    --kustomize ./
```

## References

* [How to Use kubectl cordon](https://linuxhint.com/use-kubectl-cordon/)

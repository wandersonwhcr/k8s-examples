# kubectl-context

This example shows how to configure `kubectl` with context from service account
token secret manually mounted.

```
k3d cluster create \
    --config ../k3d-example.yaml

kubectl apply \
    --kustomize ./

kubectl logs deployment/app-example
```

## References

* [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
* [Disable ServiceAccount Token](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#use-the-default-service-account-to-access-the-api-server)

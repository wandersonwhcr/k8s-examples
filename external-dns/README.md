# external-dns

```
k3d cluster create \
    --config ./k3d-example.yaml
```

```
kubectl apply \
    --kustomize ./
```

## References

* [Setting up ExternalDNS for CoreDNS with minikube](https://kubernetes-sigs.github.io/external-dns/v0.14.2/tutorials/coredns)
* [CoreDNS: etcd](https://coredns.io/plugins/etcd)

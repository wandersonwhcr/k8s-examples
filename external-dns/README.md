# external-dns

```
k3d cluster create \
    --config ./k3d-example.yaml
```

```
kubectl apply \
    --kustomize ./etcd

kubectl rollout status statefulset/etcd \
    --namespace etcd \
    --timeout 600s
```

```
kubectl apply \
    --kustomize ./coredns

kubectl rollout status deployment/coredns \
    --namespace coredns \
    --timeout 600s
```

```
kubectl apply \
    --kustomize ./

kubectl rollout status deployment/external-dns \
    --namespace external-dns \
    --timeout 600s
```

```
kubectl exec etcd-0 \
    --namespace etcd \
    --container etcd \
    -- \
        etcdctl put /skydns/local/example '{"host":"222.222.222.222","ttl":60}'

dig @coredns.coredns example.local +noall +answer
```

## References

* [Setting up ExternalDNS for CoreDNS with minikube](https://kubernetes-sigs.github.io/external-dns/v0.14.2/tutorials/coredns)
* [CoreDNS: etcd](https://coredns.io/plugins/etcd)

# coredns

This example shows how to deploy a simple CoreDNS instance and configure it to
forward requests to default Kubernetes DNS server (and in this case, another
CoreDNS).

First, create a Kubernetes cluster.

```
k3d cluster create \
    --config ./k3d-example.yaml
```

Second, deploy CoreDNS via deployment `coredns` on namespace `coredns` and
service `coredns` on the same namespace.

```
kubectl apply \
    --kustomize ./
```

... and voilà.

```
kubectl create job nslookup \
    --namespace coredns \
    --image alpine:3.20 \
    -- \
        nslookup one.one.one.one coredns.coredns

kubectl wait \
    --namespace coredns \
    --for condition=complete \
    --timeout 600s \
    job/nslookup

kubectl logs job/nslookup \
    --namespace coredns
```

```
Server:		coredns.coredns
Address:	10.43.209.248:53

Non-authoritative answer:
Name:	one.one.one.one
Address: 1.1.1.1
Name:	one.one.one.one
Address: 1.0.0.1

Non-authoritative answer:
Name:	one.one.one.one
Address: 2606:4700:4700::1111
Name:	one.one.one.one
Address: 2606:4700:4700::1001
```

## References

* [CoreDNS Manual](https://coredns.io/manual/toc/)

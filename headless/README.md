# headless

This example creates a headless service that does not use Kubernetes DNS load
balancing but resolves direct to pod IPs. Headless services can be used to
resolve pod subdomains.

This is useful when a application must known every instance running in the
service or every instance in the service must known each other, like Kafka
clients.

```
k3d cluster create \
    --config ../k3d-example.yaml

kubectl apply \
    --kustomize ./
```

```console
$ kubectl logs jobs/dn-checker --namespace app-example
+ trap exit 0 1 2 15
+ apk add --quiet bind-tools
+ dig +search +noall +answer app-example.app-example.svc
app-example.app-example.svc.cluster.local. 5 IN	A 10.42.2.14
app-example.app-example.svc.cluster.local. 5 IN	A 10.42.1.7
app-example.app-example.svc.cluster.local. 5 IN	A 10.42.3.6
+ dig +search +noall +answer app-example-0.app-example.app-example.svc
app-example-0.app-example.app-example.svc.cluster.local. 5 IN A	10.42.2.14
+ dig +search +noall +answer app-example-1.app-example.app-example.svc
app-example-1.app-example.app-example.svc.cluster.local. 5 IN A	10.42.3.6
+ dig +search +noall +answer app-example-2.app-example.app-example.svc
app-example-2.app-example.app-example.svc.cluster.local. 5 IN A	10.42.1.7
+ exit
```

## References

* [Kubernetes Headless Services](https://kubernetes.io/docs/concepts/services-networking/service/#headless-services)

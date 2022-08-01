# resources-limits

This example shows how resources limits work in Kubernetes, creating two
deployments to log CPU and Memory usage from container.

```console
$ k3d cluster create \
    --config ../k3d-example.yaml

$ kubectl apply \
    --kustomize .
```

Limits are used to set the maximum slice of CPU or quantity of Memory a
container can use. CPU limit defines how much time of CPU a container can use in
1 second. Memory limit defines how much of RAM this container can allocate.

In this example, Deployment `resources-limits-cpu` limits CPU usage of container
to `200m`, so it can use 200 milliseconds of one CPU per second. Deployment
`resources-limits-memory` limits Memory usage of container to `128Mi` or 128
Mebibytes (~134.22 Megabytes).

A Node.js application that logs CPU and Memory usage was defined, logging this
usages on `stdout`. Above commands display these outputs.

```
$ kubectl logs \
    deployment/resources-limits-cpu \
    --follow

$ kubectl logs \
    deployment/resources-limits-memory \
    --follow
```

If a container reaches CPU limits its tasks will be slower. By the way, if a
container reaches Memory Limits, Kubernetes will restart the pod.

Resources limits can be used with resources requests to improve pod allocation.

## References

* [Kubernetes Best Practices: Resource Requests and Limits](https://cloud.google.com/blog/products/containers-kubernetes/kubernetes-best-practices-resource-requests-and-limits)

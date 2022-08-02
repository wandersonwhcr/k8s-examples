# resources-requests

This example shows how resources requests work in Kubernetes, creating two
deployments from an example application setting these options.

Two tainted nodes must be created with CPU and Memory limited.
`KUBE_RESERVED_CPU` is equal to the total of CPUs available minus `1`. When
these nodes are created, Kubernetes will allocate only 1 CPU for Pod scheduling.
Also, each node receives a Memory limit by `1G` (1024 Megabytes).

```console
$ k3d cluster create \
    --config ../k3d-example.yaml

$ KUBE_RESERVED_CPU=`grep '^processor' /proc/cpuinfo | wc -l | awk '{ print $0 - 1 }'`

$ k3d node create example-agent-resources \
    --cluster example \
    --replicas 2 \
    --k3s-arg "--kubelet-arg=--kube-reserved=cpu=${KUBE_RESERVED_CPU}" \
    --memory 1G \
    --role agent \
    --k3s-node-label node.kubernetes.io/example=resources \
    --k3s-arg '--node-taint=node.kubernetes.io/example=resources:NoSchedule'
```

Deployments are created to show how Kubernetes schedules pods on these limited
nodes using taints and node selector. Deployment `resources-requests-cpu`
configures resources CPU requests by `750m` or 0.75 CPU units per second.
On the other hand, Deployment `resources-requests-memory` defines resources
Memory requests by `768M` (768 Megabytes or 0.75G). Each deployment defines 3
replicas.

```console
$ kubectl apply \
    --kustomize .
```

Kubernetes will run two Pods from Deployment `resources-requests-cpu` and one
will be pending, because there is not CPU resources available to allocate this
last one. The same will happen to Deployment `resources-requests-memory`.

```console
$ kubectl get pods \
    --namespace resources-requests \
    --sort-by metadata.name
NAME                                         READY   STATUS    RESTARTS   AGE
resources-requests-cpu-558566dcdd-bl7v2      1/1     Running   0          64s
resources-requests-cpu-558566dcdd-cghp5      0/1     Pending   0          64s
resources-requests-cpu-558566dcdd-rvjbx      1/1     Running   0          64s
resources-requests-memory-66db67668b-f2w6d   0/1     Pending   0          64s
resources-requests-memory-66db67668b-kshvj   1/1     Running   0          64s
resources-requests-memory-66db67668b-r2w28   1/1     Running   0          64s
```

Resources requests work to guarantee that Pods will receive CPU and Memory as
requested and these values will be used as base on Pod scheduling. Requests will
not limit CPU and Memory usage, they will be used only to allocate resources on
nodes.

Resources requests can be used with resources limits to defines these limits.

## References

* [Kubernetes Best Practices: Resource Requests and Limits](https://cloud.google.com/blog/products/containers-kubernetes/kubernetes-best-practices-resource-requests-and-limits)
* [Kubernetes: Reserve Compute Resources for System Daemons](https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/)

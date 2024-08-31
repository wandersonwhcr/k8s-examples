# etcd

This example shows how to create an etcd cluster on top of a Kubernetes cluster.

First, a Kubernetes cluster must be available.

```
k3d cluster create \
    --config ./k3d-example.yaml
```

You can now apply the defined resources. This example creates an etcd cluster
with one node by default, using an `Statefulset` named `etcd` on namespace
`etcd`. Also, a headless `Service` called `etcd` is defined in the same
namespace to expose client and server ports.

```
kubectl apply \
    --kustomize ./

kubectl rollout status statefulset/etcd \
    --namespace etcd \
    --timeout 600s
```

After, as described on etcd manual, you must patch environment variable
`ETCD_INITIAL_CLUSTER_STATE` default value from `new` to `existing`. This change
instructs etcd cluster not to recreate a new database whenever any pod is
recreated.

```
kubectl patch statefulset etcd \
    --namespace etcd \
    --type json \
    --patch-file patch-statefulset.yaml

kubectl rollout status statefulset/etcd \
    --namespace etcd \
    --timeout 600s
```

Check etcd cluster info using `etcdctl` on node `etcd-0`.

```
kubectl exec etcd-0 \
    --namespace etcd \
    --container etcd \
    -- \
        etcdctl endpoint status \
            --write-out table

kubectl exec etcd-0 \
    --namespace etcd \
    --container etcd \
    -- \
        etcdctl member list \
            --write-out table
```

> [!IMPORTANT]
> Both headless service ports must be named as `etcd-client` and `etcd-server`,
> because etcd peer discovery uses SRV records as defined on environment
> variable `ETCD_DISCOVERY_SRV`.

## Adding and Removing Members

To add a new member to etcd cluster, use `etcdctl` to add another peer URL,
increase replica count to `2` on statefulset and wait for the rollout. This
change will create a node called `etcd-1`.

```
kubectl exec etcd-0 \
    --namespace etcd \
    --container etcd \
    -- \
        etcdctl member add etcd-1 \
            --peer-urls http://etcd-1.etcd.etcd.svc.cluster.local:2380

kubectl scale statefulset etcd \
    --namespace etcd \
    --replicas 2

kubectl rollout status statefulset/etcd \
    --namespace etcd \
    --timeout 600s
```

Check if etcd cluster is working, configuring a key `greeting` with value `Hello
World` on node `etcd-0`, and reading its value on node `etcd-1`.

```
kubectl exec etcd-0 \
    --namespace etcd \
    --container etcd \
    -- \
        etcdctl put greeting 'Hello World'

kubectl exec etcd-1 \
    --namespace etcd \
    --container etcd \
    -- \
        etcdctl get greeting
```

To remove added member, retrieve the `MemberID` value via `etcdctl` on node
`etcd-1` and execute the removal on node `etcd-0`. Reduce replica count to `1`
and wait for statefulset rollout.

```
ETCD_MEMBER_ID=`
    kubectl exec etcd-1 \
        --namespace etcd \
        --container etcd \
        -- \
            etcdctl endpoint status \
                --write-out fields \
        | grep MemberID \
        | awk '{ print $3 }' \
        | xargs printf '%x'
`

kubectl exec etcd-0 \
    --namespace etcd \
    --container etcd \
    -- \
        etcdctl member remove "$ETCD_MEMBER_ID"

kubectl scale statefulset etcd \
    --namespace etcd \
    --replicas 1

kubectl rollout status statefulset/etcd \
    --namespace etcd \
    --timeout 600s
```

## References

* [Run etcd clusters as a Kubernetes StatefulSet](https://etcd.io/docs/v3.5/op-guide/kubernetes/)
* [StatefulSet: Parallel Pod Management](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/#parallel-pod-management)
* [Clustering Guide: DNS Discovery](https://etcd.io/docs/v3.5/op-guide/clustering/#dns-discovery)
* [How to Add and Remove Members](https://etcd.io/docs/v3.5/tutorials/how-to-deal-with-membership/)

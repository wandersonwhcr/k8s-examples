# node-affinity

This example shows how to assign pods to nodes using labels.

When cluster is created, k3d adds 3 agents and they are labeled using `kubectl`:

* `k3d-example-agent-0` without `topology.kubernetes.io/region`
* `k3d-example-agent-1` with `topology.kubernetes.io/region` equals to `us-east-1`
* `k3d-example-agent-2` with `topology.kubernetes.io/region` equals to `sa-east-1`

```
k3d cluster create \
    --config ../k3d-example.yaml

kubectl label nodes \
    k3d-example-agent-0 topology.kubernetes.io/region-

kubectl label nodes \
    k3d-example-agent-1 topology.kubernetes.io/region=us-east-1

kubectl label nodes \
    k3d-example-agent-2 topology.kubernetes.io/region=sa-east-1

kubectl apply \
    --kustomize ./
```

```
kubectl get pods --namespace app-example --output json \
    | jq '.items[]' \
    | jq '{"node": .spec.nodeName, "name": .metadata.name}' \
    | jq --slurp 'sort_by(.node, .name)' \
    | jq '.[]' --compact-output

{"node":"k3d-example-agent-0","name":"app-example-global-67c84c9f84-4wqbh"}
{"node":"k3d-example-agent-0","name":"app-example-global-67c84c9f84-t2m5q"}
{"node":"k3d-example-agent-0","name":"app-example-global-67c84c9f84-tp5fk"}
{"node":"k3d-example-agent-1","name":"app-example-global-67c84c9f84-dkhqh"}
{"node":"k3d-example-agent-1","name":"app-example-global-67c84c9f84-gb2c2"}
{"node":"k3d-example-agent-1","name":"app-example-global-67c84c9f84-m2wvf"}
{"node":"k3d-example-agent-1","name":"app-example-us-east-1-769947f7dd-l46sp"}
{"node":"k3d-example-agent-1","name":"app-example-us-east-1-769947f7dd-tnnnx"}
{"node":"k3d-example-agent-1","name":"app-example-us-east-1-769947f7dd-vl9f7"}
{"node":"k3d-example-agent-2","name":"app-example-global-67c84c9f84-gkpd6"}
{"node":"k3d-example-agent-2","name":"app-example-global-67c84c9f84-n95xd"}
{"node":"k3d-example-agent-2","name":"app-example-global-67c84c9f84-pdvwb"}
{"node":"k3d-example-agent-2","name":"app-example-sa-east-1-6d68f5648d-bcppf"}
{"node":"k3d-example-agent-2","name":"app-example-sa-east-1-6d68f5648d-h4lgz"}
{"node":"k3d-example-agent-2","name":"app-example-sa-east-1-6d68f5648d-t54hc"}
```

As seen, `app-example-global` replicas will run on any node because they are not
defined with node affinity. If you want to avoid node to run some kind of pods
you must use taints and tolerations.

## References

* [Assign Pods to Nodes](https://kubernetes.io/docs/tasks/configure-pod-container/assign-pods-nodes/)

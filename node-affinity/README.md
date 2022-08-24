# node-affinity

```
k3d cluster create \
    --config ../k3d-example.yaml

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

## References

* [Assign Pods to Nodes](https://kubernetes.io/docs/tasks/configure-pod-container/assign-pods-nodes/)

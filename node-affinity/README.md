# node-affinity

```
k3d cluster create \
    --config ../k3d-example.yaml

kubectl label nodes \
    k3d-example-agent-1 topology.kubernetes.io/zone=us-east-1
kubectl label nodes \
    k3d-example-agent-2 topology.kubernetes.io/zone=sa-east-1
```

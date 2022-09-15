# cassandra

```
k3d cluster create \
    --config ../k3d-example.yaml \
    && sleep 2 \
    && k3d node create example-agent-cassandra \
        --cluster example \
        --replicas 1 \
        --memory 2G \
        --role agent \
        --k3s-arg --node-taint=node.kubernetes.io/owner=cassandra:NoSchedule

kubectl apply \
    --kustomize ./
```

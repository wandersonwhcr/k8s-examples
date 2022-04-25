# one-replica-per-node

```
k3d cluster create example \
    --servers 1 \
    --agents 3 \
    --no-lb

kubectl taint nodes \
    --selector node-role.kubernetes.io/master=true \
    node-role.kubernetes.io/master=:NoSchedule
```

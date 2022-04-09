# priority-class

```
k3d cluster create example \
    --servers 1 \
    --agents 1 \
    --agents-memory 1G \
    --no-lb

kubectl taint nodes \
    --selector node-role.kubernetes.io/master=true \
    node-role.kubernetes.io/master=:NoSchedule

kubectl apply \
    --kustomize .
```

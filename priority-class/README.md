# priority-class

A `PriorityClass` Example

```
k3d cluster create example \
    --servers 1 \
    --agents 0 \
    --port 80:80@loadbalancer

kubectl apply \
    --kustomize k8s

k3d node create priority-normal \
    --cluster example \
    --k3s-node-label priority=normal

k3d node create priority-high \
    --cluster example \
    --k3s-node-label priority=high
```

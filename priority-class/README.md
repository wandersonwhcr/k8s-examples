# priority-class

A `PriorityClass` Example

```
k3d cluster create example \
    --servers 1 \
    --agents 1 \
    --port 80:80@loadbalancer

kubectl apply \
    --kustomize k8s
```

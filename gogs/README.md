# gogs

This example installs Gogs into namespace `gogs` and available on
http://gogs.example.localhost.

```
k3d cluster create example \
    --servers 1 \
    --agents 1 \
    --port 80:80@loadbalancer

kubectl apply \
    --kustomize .
```

# mongodb

This examples shows how to install MongoDB on Kubernetes using StatefulSets.
Also, it deploys Mongo Express to manage resources on database.

```
k3d cluster create example \
    --servers 1 \
    --agents 1 \
    --no-lb

kubectl apply \
    --kustomize .

kubectl port-forward \
    service/express 8080:80 \
    --namespace mongodb
```

# readiness

This example creates an Alpine container to execute a `sleep.sh` script mounted
via ConfigMap that creates a `/tmp/healthy` file after 30 seconds. Kubernetes
readiness probe will define pod as ready after `/tmp/healthy` file is created.

```
k3d cluster create example \
    --servers 1 \
    --agents 1 \
    --no-lb

kubectl apply \
    --kustomize .
```

```
$ kubectl get pods -w
NAME                     READY   STATUS              RESTARTS   AGE
sleep-7c6d9678bb-bx9lt   0/1     ContainerCreating   0          3s
sleep-7c6d9678bb-bx9lt   0/1     Running             0          7s
sleep-7c6d9678bb-bx9lt   1/1     Running             0          37s
```

# readiness

This example creates an Alpine container to execute `sleep.sh` script mounted
via ConfigMap that creates `/tmp/healthy` file after 30 seconds. Kubernetes
readiness probe will define pod as ready after this file is created.

```
k3d cluster create example \
    --servers 1 \
    --agents 1 \
    --no-lb

kubectl apply \
    --kustomize .
```

```
$ kubectl get pods --watch
NAME                     READY   STATUS              RESTARTS   AGE
sleep-7c6d9678bb-bx9lt   0/1     ContainerCreating   0          3s
sleep-7c6d9678bb-bx9lt   0/1     Running             0          7s
sleep-7c6d9678bb-bx9lt   1/1     Running             0          37s
```

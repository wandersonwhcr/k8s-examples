# priority-class

This example creates a k3d cluster, disabling master nodes scheduling and
limiting agents memory to 1G. After that, it creates two priority classes `high`
and `normal` and two deployments homonyms using priority related. Each
deployment limits memory container resource to 512M. Kubernetes will schedule
only two high deployment `PriorityClass` because its memory limits.

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

```
$ kubectl get pods
NAME                      READY   STATUS    RESTARTS   AGE
normal-6b958c4bd7-d6s75   0/1     Pending   0          55s
normal-6b958c4bd7-6gbf8   0/1     Pending   0          54s
high-67bdccf477-9zhb7     1/1     Running   0          55s
high-67bdccf477-k8j8p     1/1     Running   0          55s
```

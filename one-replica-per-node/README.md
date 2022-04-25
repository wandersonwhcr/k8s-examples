# one-replica-per-node

```
k3d cluster create example \
    --servers 1 \
    --agents 3 \
    --no-lb

kubectl taint nodes \
    --selector node-role.kubernetes.io/master=true \
    node-role.kubernetes.io/master=:NoSchedule

kubectl apply \
    --kustomize .
```

```
$ kubectl get pods --namespace example --output wide
NAME                      READY   STATUS    RESTARTS   AGE   IP          NODE                  NOMINATED NODE   READINESS GATES
example-7cfd9ffb4-b5th2   1/1     Running   0          9s    10.42.1.8   k3d-example-agent-2   <none>           <none>
example-7cfd9ffb4-ss9k7   1/1     Running   0          9s    10.42.3.8   k3d-example-agent-0   <none>           <none>
example-7cfd9ffb4-jhcwr   1/1     Running   0          9s    10.42.2.9   k3d-example-agent-1   <none>           <none>
```

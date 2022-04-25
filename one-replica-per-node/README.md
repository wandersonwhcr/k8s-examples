# one-replica-per-node

This example shows how to use anti affinity to run one deployment replica per
cluster node.

Basically, it defines a rule that avoids pod scheduling if some pod is running
according to match expression by key. In this example, it checks if pods of the
same deployment are running by node hostname, avoiding schedule.

This config will improve reliability if cluster nodes stop constantly, because
if one node stops, it will guarantee that other replicas are running on other
nodes.

One issue to avoid: this cluster example has 3 agents, there is not autoscaling,
and our deployment has 3 replicas. If you need to rollout this deployment, it
will not schedule new pods because there is not available nodes according to
anti affinity rules.

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
$ kubectl rollout restart deployment example --namespace example
$ kubectl get pods --namespace example --output wide
NAME                       READY   STATUS    RESTARTS   AGE   IP          NODE                  NOMINATED NODE   READINESS GATES
example-7cfd9ffb4-b5th2    1/1     Running   0          18m   10.42.1.8   k3d-example-agent-2   <none>           <none>
example-7cfd9ffb4-ss9k7    1/1     Running   0          18m   10.42.3.8   k3d-example-agent-0   <none>           <none>
example-7cfd9ffb4-jhcwr    1/1     Running   0          18m   10.42.2.9   k3d-example-agent-1   <none>           <none>
example-647568f54f-2ld8d   0/1     Pending   0          17m   <none>      <none>                <none>           <none>
```

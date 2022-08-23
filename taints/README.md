# taints

This example creates a Kubernetes cluster with 3 agent nodes.

After, it removes pod scheduling on `k3d-example-agent-1` node using taints,
configuring node using key `foo` and value `bar` with effect of `NoSchedule`,
informing cluster to not schedule pods on this node unless pod tolerations are
defined. To remove pods already running on node, it drains this node ignoring
daemonsets, because this kind of resource always run on `NoSchedule` tainted
nodes. `kubectl uncordon` is used to reallow pod scheduling on node.


At last, node `k3d-example-agent-2` is tainted with key `foo` and value `bar`,
but with effect of `NoExecute`, removing all pods running on that node
immediately, including daemonsets.

```
k3d cluster create \
    --config ../k3d-example.yaml

kubectl taint node k3d-example-agent-1 foo=bar:NoSchedule

kubectl drain k3d-example-agent-1 \
    --ignore-daemonsets

kubectl uncordon k3d-example-agent-1

kubectl taint node k3d-example-agent-2 foo=bar:NoExecute
```

```console
$ kubectl get pods --all-namespaces --field-selector spec.nodeName=k3d-example-agent-1 --output wide
NAMESPACE     NAME                              READY   STATUS    RESTARTS   AGE    IP          NODE                  NOMINATED NODE   READINESS GATES
kube-system   coredns-d76bd69b-fdzkq            1/1     Running   0          2m9s   10.42.1.2   k3d-example-agent-1   <none>           <none>
kube-system   metrics-server-7cd5fcb6b7-cp4g9   1/1     Running   0          2m9s   10.42.1.3   k3d-example-agent-1   <none>           <none>
kube-system   svclb-traefik-cdkxc               2/2     Running   0          100s   10.42.1.4   k3d-example-agent-1   <none>           <none>

$ kubectl get pods --all-namespaces --field-selector spec.nodeName=k3d-example-agent-2 --output wide
No resources found
```

After, a `Deployment` can be applied to check if tolerations work.

```
kubectl apply \
    --kustomize ./
```

```console
$ kubectl get pods --namespace app-example --sort-by spec.nodeName --output wide
NAME                          READY   STATUS    RESTARTS   AGE   IP          NODE                  NOMINATED NODE   READINESS GATES
app-example-b8b84587d-nwhmx   1/1     Running   0          38s   10.42.2.6   k3d-example-agent-0   <none>           <none>
app-example-b8b84587d-b8fk8   1/1     Running   0          37s   10.42.2.8   k3d-example-agent-0   <none>           <none>
app-example-b8b84587d-ll2hz   1/1     Running   0          38s   10.42.2.7   k3d-example-agent-0   <none>           <none>
app-example-b8b84587d-7llr6   1/1     Running   0          37s   10.42.3.5   k3d-example-agent-1   <none>           <none>
app-example-b8b84587d-bq9xb   1/1     Running   0          38s   10.42.3.6   k3d-example-agent-1   <none>           <none>
app-example-b8b84587d-bdpqf   1/1     Running   0          38s   10.42.3.4   k3d-example-agent-1   <none>           <none>
app-example-b8b84587d-gkbbq   1/1     Running   0          38s   10.42.0.7   k3d-example-agent-2   <none>           <none>
app-example-b8b84587d-wshbn   1/1     Running   0          37s   10.42.0.8   k3d-example-agent-2   <none>           <none>
app-example-b8b84587d-2h9p7   1/1     Running   0          38s   10.42.0.5   k3d-example-agent-2   <none>           <none>
app-example-b8b84587d-cmbfw   1/1     Running   0          38s   10.42.0.6   k3d-example-agent-2   <none>           <none>

$ kubectl get pods --all-namespaces --field-selector spec.nodeName=k3d-example-agent-1 --output wide
NAMESPACE     NAME                          READY   STATUS    RESTARTS   AGE     IP          NODE                  NOMINATED NODE   READINESS GATES
kube-system   svclb-traefik-47rwx           2/2     Running   0          2m31s   10.42.3.3   k3d-example-agent-1   <none>           <none>
app-example   app-example-b8b84587d-7llr6   1/1     Running   0          66s     10.42.3.5   k3d-example-agent-1   <none>           <none>
app-example   app-example-b8b84587d-bq9xb   1/1     Running   0          67s     10.42.3.6   k3d-example-agent-1   <none>           <none>
app-example   app-example-b8b84587d-bdpqf   1/1     Running   0          67s     10.42.3.4   k3d-example-agent-1   <none>           <none>

$ kubectl get pods --all-namespaces --field-selector spec.nodeName=k3d-example-agent-2 --output wide
NAMESPACE     NAME                          READY   STATUS    RESTARTS   AGE   IP          NODE                  NOMINATED NODE   READINESS GATES
app-example   app-example-b8b84587d-cmbfw   1/1     Running   0          85s   10.42.0.6   k3d-example-agent-2   <none>           <none>
app-example   app-example-b8b84587d-gkbbq   1/1     Running   0          85s   10.42.0.7   k3d-example-agent-2   <none>           <none>
app-example   app-example-b8b84587d-wshbn   1/1     Running   0          84s   10.42.0.8   k3d-example-agent-2   <none>           <none>
app-example   app-example-b8b84587d-2h9p7   1/1     Running   0          85s   10.42.0.5   k3d-example-agent-2   <none>           <none>
```
As seen, pod tolerations will not force scheduling on tainted nodes only, but
this behavior can be defined using node affinity. Also, daemonsets has
tolerations on `NoSchedule` effects, but not on `NoExecute`.

## References

* [Taints and Tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/)
* [How to Use kubectl cordon](https://linuxhint.com/use-kubectl-cordon/)

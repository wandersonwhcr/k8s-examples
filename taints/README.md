# taints

This example creates a Kubernetes cluster with 3 agent nodes. After, it removes
pod scheduling from `k3d-example-agent-2` node using `kubectl cordon`. Also, it
marks node with taint using key `foo` and value `bar` with effect of
`NoSchedule`, informing cluster to not schedule pods on this node unless pod
tolerations are defined. To remove pods already running on node, it drains this
node ignoring daemonsets, because this kind of resource always run on
`NoSchedule` tainted nodes. At last, `kubectl uncordon` is used to reallow pod
scheduling on node.

```
k3d cluster create \
    --config ../k3d-example.yaml

kubectl cordon k3d-example-agent-2

kubectl taint node k3d-example-agent-2 foo=bar:NoSchedule

kubectl drain k3d-example-agent-2 \
    --ignore-daemonsets

kubectl uncordon k3d-example-agent-2
```

After, a `Deployment` can be applied to check if tolerations work.

```
kubectl apply \
    --kustomize ./
```

```console
$ kubectl get pods --namespace app-example --sort-by spec.nodeName --output wide
NAME                          READY   STATUS    RESTARTS   AGE   IP           NODE                  NOMINATED NODE   READINESS GATES
app-example-9ddd674b5-rfs7w   1/1     Running   0          4m    10.42.1.12   k3d-example-agent-0   <none>           <none>
app-example-9ddd674b5-bjlnr   1/1     Running   0          4m    10.42.1.13   k3d-example-agent-0   <none>           <none>
app-example-9ddd674b5-2hbmq   1/1     Running   0          4m    10.42.1.14   k3d-example-agent-0   <none>           <none>
app-example-9ddd674b5-r7qhl   1/1     Running   0          4m    10.42.2.15   k3d-example-agent-1   <none>           <none>
app-example-9ddd674b5-w8f5f   1/1     Running   0          4m    10.42.2.14   k3d-example-agent-1   <none>           <none>
app-example-9ddd674b5-v76dk   1/1     Running   0          4m    10.42.2.13   k3d-example-agent-1   <none>           <none>
app-example-9ddd674b5-qvq46   1/1     Running   0          4m    10.42.3.7    k3d-example-agent-2   <none>           <none>
app-example-9ddd674b5-fhhth   1/1     Running   0          4m    10.42.3.10   k3d-example-agent-2   <none>           <none>
app-example-9ddd674b5-8glf5   1/1     Running   0          4m    10.42.3.9    k3d-example-agent-2   <none>           <none>
app-example-9ddd674b5-bgh99   1/1     Running   0          4m    10.42.3.8    k3d-example-agent-2   <none>           <none>

$ kubectl get pods --all-namespaces --field-selector spec.nodeName=k3d-example-agent-2 --output wide
NAMESPACE     NAME                          READY   STATUS    RESTARTS   AGE   IP           NODE                  NOMINATED NODE   READINESS GATES
kube-system   svclb-traefik-rvvhx           2/2     Running   0          41m   10.42.3.3    k3d-example-agent-2   <none>           <none>
app-example   app-example-9ddd674b5-fhhth   1/1     Running   0          19m   10.42.3.10   k3d-example-agent-2   <none>           <none>
app-example   app-example-9ddd674b5-8glf5   1/1     Running   0          19m   10.42.3.9    k3d-example-agent-2   <none>           <none>
app-example   app-example-9ddd674b5-qvq46   1/1     Running   0          19m   10.42.3.7    k3d-example-agent-2   <none>           <none>
app-example   app-example-9ddd674b5-bgh99   1/1     Running   0          19m   10.42.3.8    k3d-example-agent-2   <none>           <none>
```
As seen, pod tolerations will not force scheduling on tainted node, but this
behavior can be defined using node affinity.

## References

* [Taints and Tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/)
* [How to Use kubectl cordon](https://linuxhint.com/use-kubectl-cordon/)

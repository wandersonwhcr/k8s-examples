# taint

```
k3d cluster create \
    --config ../k3d-example.yaml
```

```
kubectl cordon k3d-example-agent-2

kubectl taint node k3d-example-agent-2 foo:bar=NoSchedule

kubectl drain k3d-example-agent-2 \
    --ignore-daemonsets

kubectl uncordon k3d-example-agent-2

kubectl apply \
    --kustomize ./
```

```console
$ kubectl get pods --namespace app-example --output wide --sort-by spec.nodeName
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
```

## References

* [Taints and Tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/)
* [How to Use kubectl cordon](https://linuxhint.com/use-kubectl-cordon/)

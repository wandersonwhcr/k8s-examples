# cronjob-scale

This example shows how to scale deployments using cronjobs.

Basically, it creates one simple `Deployment` called `app-example`. Two
`CronJob` are defined: `app-example-scale-up` executes every odd minute
increasing replica count to 10 and `app-example-scale-down` executes on even
minutes decreasing replica count to 1.

These `CronJob` initialize pods using a custom `ServiceAccount` with permissions
to patch `app-example` deployment using `Role` and `RoleBinding`.

```
k3d cluster create \
    --config ../k3d-example.yaml

kubectl apply \
    --kustomize ./
```

```
kubectl auth can-i get deployments/app-example \
    --namespace app-example \
    --as system:serviceaccount:app-example:app-example-scale

kubectl auth can-i patch deployments/app-example \
    --subresource scale \
    --namespace app-example \
    --as system:serviceaccount:app-example:app-example-scale
```

```console
$ date && kubectl get pods --sort-by metadata.name
Sat 13 Aug 2022 05:01:16 AM -03
NAME                                    READY   STATUS      RESTARTS   AGE
app-example-d59455f46-vpwng             1/1     Running     0          16m
app-example-scale-down-27672961-bgqsm   0/1     Completed   0          16s
app-example-scale-up-27672960-k5mfb     0/1     Completed   0          76s

$ date && kubectl get pods --sort-by metadata.name
Sat 13 Aug 2022 05:02:23 AM -03
NAME                                    READY   STATUS      RESTARTS   AGE
app-example-d59455f46-7fsp7             1/1     Running     0          18s
app-example-d59455f46-dq8m8             1/1     Running     0          18s
app-example-d59455f46-ffw4t             1/1     Running     0          18s
app-example-d59455f46-kcrlm             1/1     Running     0          18s
app-example-d59455f46-nqk2t             1/1     Running     0          18s
app-example-d59455f46-q7w6k             1/1     Running     0          18s
app-example-d59455f46-t267l             1/1     Running     0          18s
app-example-d59455f46-vpwng             1/1     Running     0          17m
app-example-d59455f46-vw2pr             1/1     Running     0          18s
app-example-d59455f46-xbmx4             1/1     Running     0          18s
app-example-scale-down-27672961-bgqsm   0/1     Completed   0          83s
app-example-scale-up-27672962-whj5q     0/1     Completed   0          23s
```

## References

* [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
* [crontab guru](https://crontab.guru/)
* [cURLing the Kubernetes API Server](https://nieldw.medium.com/curling-the-kubernetes-api-server-d7675cfc398c)
* [Authorization: Checking API Access](https://kubernetes.io/docs/reference/access-authn-authz/authorization/#checking-api-access)

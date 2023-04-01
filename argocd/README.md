# argocd

This example shows how to install Argo CD and uses it to deploy an example
application via `AppProject` and `Application` Custom Resources Definitions.

```
k3d cluster create \
    --config ../k3d-example.yaml

kubectl apply \
    --kustomize ./argocd
```

After that, deploy a Guestbook application from Argo CD examples using CRDs.

```
kubectl apply \
    --kustomize ./app-guestbook
```

Check application sync status using Argo CD UI.

```
kubectl port-forward service/argocd-server 8443:443 \
    --namespace argocd
```

Argo CD UI will be available [here](https://localhost:8443). To retrieve initial
password, use this command.

```
# Username: admin
# Password
kubectl get secrets argocd-initial-admin-secret \
    --namespace argocd \
    --output 'jsonpath={.data.password}' \
    | base64 --decode
```

References:

* [Argo CD](https://argo-cd.readthedocs.io/en/stable/)
* [Argo CD: Operator Manual](https://argo-cd.readthedocs.io/en/stable/operator-manual/)
* [Argo CD: User Guide](https://argo-cd.readthedocs.io/en/stable/user-guide/)
* [tfinardi: Argo CD Demo](https://github.com/tfinardi/argocd-demo)

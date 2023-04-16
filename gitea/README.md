# gitea

This example shows how to install Gitea using Helm Charts. Gitea is a painless
self-hosted Git service written in Go.

```
k3d cluster create \
    --config ../k3d-example.yaml

helm dependency build

helm install gitea . \
    --namespace gitea \
    --create-namespace
```

Wait for `Statefulset` `gitea` rollout on namespace `gitea` with timeout of 10
minutes.

```
kubectl rollout status statefulset/gitea \
    --namespace gitea \
    --timeout 600s

kubectl port-forward service/gitea-http 3000 \
    --namespace gitea
```

After this, access Gitea using port forward on
[http://localhost:3000](http://localhost:3000).

You can authenticate with username `root` and password `root1234`.

## References

* [Gitea](https://gitea.io/)
* [Gitea Helm Chart](https://gitea.com/gitea/helm-chart/)
* [Helm Dependency](https://helm.sh/docs/helm/helm_dependency/)

# tekton

```
k3d cluster create \
    --config ../k3d-example.yaml
```

```
pushd .

cd ../gitea/

helm dependency build

helm install gitea . \
    --namespace gitea \
    --create-namespace

popd
```

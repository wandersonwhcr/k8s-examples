# microservices

```
k3d cluster create \
    --config ../k3d-example.yaml
```

```
for APPLICATION in app-music app-artists app-albums; do
    docker build "./$APPLICATION/src" \
        --tag "k3d-example-registry:5000/$APPLICATION"
    docker push "k3d-example-registry:5000/$APPLICATION"
done
```

```
kubectl apply \
    --kustomize ../mongodb

kubectl apply \
    --kustomize ./app-artists

kubectl apply \
    --kustomize ./app-albums
```

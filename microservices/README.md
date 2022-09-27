# microservices

This example creates microservices to handle Artists and Albums data. It defines
03 microservices: `app-artists` and `app-albums` to handle Artists and Albums
objects using RESTful API that stores data on MongoDB, and `app-music` to
improve querying via GraphQL.

```
k3d cluster create \
    --config ../k3d-example.yaml

kubectl apply \
    --kustomize ../mongodb
```

Every microservice must be built locally and pushed to
`k3d-example-registry:5000` Docker Registry pointing to `127.0.0.1`.

```
for APPLICATION in app-music app-artists app-albums; do
    docker build "./$APPLICATION/src" \
        --tag "k3d-example-registry:5000/$APPLICATION"
    docker push "k3d-example-registry:5000/$APPLICATION"
done
```

After, these resources must be deployed on Kubernetes. Every application is
isolated using namespaces and can be access via ingresses.

```
kubectl apply \
    --kustomize ./app-artists

kubectl apply \
    --kustomize ./app-albums

kubectl apply \
    --kustomize ./app-music
```

# minio

This example adds an example of how to install MinIO on Kubernetes. It defines
the default root username and password based on AWS access key id and secret
access keys examples.

```
k3d cluster create \
    --config ../k3d-example.yaml

kubectl apply \
    --kustomize .

kubectl port-forward \
    service/minio 9001 \
    --namespace minio
```

* [MinIO Console](http://localhost:9001)

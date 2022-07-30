# keda

```console
$ k3d cluster create \
    --config ../k3d-example.yaml

$ kubectl create \
    --kustomize ../prometheus/prometheus-operator

$ kubectl apply \
    --kustomize ../prometheus

$ kubectl apply \
    --filename https://github.com/kedacore/keda/releases/download/v2.7.1/keda-2.7.1.yaml

$ kubectl apply \
    --kustomize ./app-example
```

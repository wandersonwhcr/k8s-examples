# grafana

```sh
k3d cluster create \
    --config ../k3d-example.yaml

kubectl apply \
    --kustomize ./grafana-operator

kubectl apply \
    --kustomize ./
```

## References

* [Grafana Operator](https://github.com/grafana-operator/grafana-operator)

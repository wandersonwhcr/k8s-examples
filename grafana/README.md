# grafana

```sh
k3d cluster create \
    --config ../k3d-example.yaml

kubectl apply \
    --kustomize ./grafana-operator

kubectl apply \
    --kustomize ./
```

```sh
# Username: admin
# Password
kubectl get secrets grafana-admin-credentials \
    --output 'jsonpath={.data.GF_SECURITY_ADMIN_PASSWORD}' \
    | base64 --decode
```

## References

* [Grafana Operator](https://github.com/grafana-operator/grafana-operator)

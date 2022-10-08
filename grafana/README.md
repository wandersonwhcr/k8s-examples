# grafana

```sh
k3d cluster create \
    --config ../k3d-example.yaml

kubectl create \
    --kustomize ../prometheus/prometheus-operator

kubectl apply \
    --kustomize ../prometheus

kubectl apply \
    --kustomize ./grafana-operator

kubectl apply \
    --kustomize ./
```

```sh
# Username: admin
# Password
kubectl get secrets grafana-admin-credentials \
    --namespace grafana \
    --output 'jsonpath={.data.GF_SECURITY_ADMIN_PASSWORD}' \
    | base64 --decode
```

```sh
kubectl apply \
    --kustomize ./app-example
```

```sh
kubectl get events \
    --namespace app-example \
    --field-selector involvedObject.kind=GrafanaDashboard
```

```
LAST SEEN   TYPE      REASON            OBJECT                         MESSAGE
8m23s       Warning   ProcessingError   grafanadashboard/app-example   error creating folder, expected status 200 but got 409
8m23s       Normal    Success           grafanadashboard/app-example   dashboard app-example/app-example successfully submitted
```

```sh
kubectl port-forward service/grafana-service 3000 \
    --namespace grafana
```

[Example Application Dashboard](http://localhost:3000/d/6ef68b176e/example-application?orgId=1&refresh=5s)

## References

* [Grafana Operator](https://github.com/grafana-operator/grafana-operator)
* [Grafana JSON Model](https://grafana.com/docs/grafana/v9.0/dashboards/json-model/)

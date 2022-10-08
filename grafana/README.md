# grafana

This example shows how to use Grafana Operator to deploy a Grafana instance and
create a dashboard to observe an example application using metrics from
Prometheus.

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

This example defines this dashboard using custom resource definition, showing
all alerts from `app-example` namespace and counting how much instances are up
and running.

```sh
kubectl apply \
    --kustomize ./app-example
```

Check if dashboard was created successfully listing all events from its kind.

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

After, execute a port forward from Grafana service.

```sh
kubectl port-forward service/grafana-service 3000 \
    --namespace grafana
```

Example Application dashboard will be available
[here](http://localhost:3000/d/6ef68b176e/example-application?orgId=1&refresh=5s).


Grafana dashboards can be accessed without authentication. If needed,
credentials are defined on `grafana-admin-credentials` secret.

```sh
# Username: admin
# Password
kubectl get secrets grafana-admin-credentials \
    --namespace grafana \
    --output 'jsonpath={.data.GF_SECURITY_ADMIN_PASSWORD}' \
    | base64 --decode
```

## References

* [Grafana Operator](https://github.com/grafana-operator/grafana-operator)
* [Grafana JSON Model](https://grafana.com/docs/grafana/v9.0/dashboards/json-model/)

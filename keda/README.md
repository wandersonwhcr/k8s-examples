# keda

This example shows how to use KEDA, an autoscaler for Kubernetes that uses more
sources to calculate how many replicas a Deployment or Statefulset must have.
KEDA can be used with Prometheus to compute replica count.

```console
$ k3d cluster create \
    --config ../k3d-example.yaml

$ kubectl create \
    --kustomize ../prometheus/prometheus-operator

$ kubectl apply \
    --kustomize ../prometheus

$ kubectl apply \
    --filename https://github.com/kedacore/keda/releases/download/v2.7.1/keda-2.7.1.yaml
```

Here, there is an Example Application using Nginx with a Nginx Prometheus
Exporter sidecar. It includes a Service Monitor used by Prometheus to scrape
metrics from this example.

Let's think this application can't have more than 100 active connections,
because there's a problem with concurrency.

Because of this, a KEDA Scaled Object was defined using Prometheus to check how
many Nginx connections are active. With a threshold of 100, KEDA will try to
keep the active connections per pod below this number.

```console
$ kubectl apply \
    --kustomize ./app-example
```

A benchmark can be used to increase active connections. KEDA will autoscale
example application.

```console
$ kubectl apply \
    --kustomize ./app-benchmark

$ kubectl logs \
    --namespace app-benchmark \
    jobs/app-benchmark
```

Prometheus query interface can be used to check the average of active
connections.

```plain
avg by(namespace, service) (
  nginx_connections_active{namespace="app-example", service="app-example"}
)
```

## References

* [KEDA: Kubernetes Event-driven Autoscaling](https://keda.sh/)
* [KEDA: Scaling Deployments](https://keda.sh/docs/2.7/concepts/scaling-deployments/)
* [KEDA: Prometheus Scaler](https://keda.sh/docs/2.7/scalers/prometheus/)

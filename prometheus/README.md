# prometheus

This example shows how to install Prometheus Operator on Kubernetes. Kustomize
was used because the Operator installer creates resources in `default` namespace
and this example installs the operator in `prometheus-operator` namespace. To
avoid `kubectl` errors on saving applied configurations as annotations, `create`
must be used instead of `apply`.

```sh
k3d cluster create \
    --config ../k3d-example.yaml

kubectl create \
    --kustomize ./prometheus-operator
```

```console
$ kubectl get crd | grep monitoring.coreos.com | cut -d' ' -f1
alertmanagerconfigs.monitoring.coreos.com
alertmanagers.monitoring.coreos.com
podmonitors.monitoring.coreos.com
probes.monitoring.coreos.com
prometheuses.monitoring.coreos.com
prometheusrules.monitoring.coreos.com
servicemonitors.monitoring.coreos.com
thanosrulers.monitoring.coreos.com

$ kubectl get pods --namespace prometheus-operator
NAME                                   READY   STATUS    RESTARTS   AGE
prometheus-operator-5874d4bdb7-h2gl5   1/1     Running   0          4s
```

Using the Operator and CRDs, it deploys a Prometheus instance in `prometheus`
namespace with Alertmanager and they are configured to receive service monitors
configurations from all namespaces. It also defines `ServiceMonitor` to scrap
metrics from these resources and creates simple `PrometheusRule` to check if
these resources are unavailable.

```sh
kubectl apply \
    --kustomize .
```

```console
$ kubectl get pods --namespace prometheus
NAME                          READY   STATUS    RESTARTS   AGE
prometheus-prometheus-0       2/2     Running   0          4s
alertmanager-alertmanager-0   2/2     Running   0          5s

$ kubectl get services --namespace prometheus
NAME                    TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)                      AGE
prometheus-operated     ClusterIP   None         <none>        9090/TCP                     10s
alertmanager-operated   ClusterIP   None         <none>        9093/TCP,9094/TCP,9094/UDP   10s

$ kubectl port-forward service/prometheus-operated 9090 --namespace prometheus

$ kubectl port-forward service/alertmanager-operated 9093 --namespace prometheus
```

Finally, an application example can be deployed, showing how to define
Prometheus resources. It is a Nginx `Deployment` with Nginx Prometheus Exporter
as sidecar to export metrics captured by Prometheus.

```sh
kubectl apply \
    --kustomize app-example
```

```console
$ kubectl get pods --namespace app-example
NAME                           READY   STATUS    RESTARTS   AGE
app-example-7d99566685-cl2bs   2/2     Running   0          12s
app-example-7d99566685-97zr9   2/2     Running   0          10s
app-example-7d99566685-mscvq   2/2     Running   0          9s
```

## References

* [Prometheus Annotations Support](https://github.com/prometheus-operator/prometheus-operator/issues/1547)

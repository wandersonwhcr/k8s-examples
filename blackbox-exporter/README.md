# blackbox-exporter

This example shows how to install Blackbox Exporter.

Prometheus `ServiceMonitor` will only scrape metrics direct from `Pod` IPs. To
check if `Service` is up, use `Probe` with static host address.

```
k3d cluster create \
    --config ../k3d-example.yaml

kubectl create \
    --kustomize ../prometheus/prometheus-operator

kubectl apply \
    --kustomize ../prometheus

kubectl apply \
    --kustomize ./
```

Install this example that contains a `Probe` resource to configure Prometheus to
make HTTP requests directly to the `Service`. This is useful to check if service
host is responding correctly, especially on Istio `VirtualService`, where only a
subset of pods are used.

```
kubectl apply \
    --kustomize ./app-example
```

```console
$ kubectl logs deployment/app-example --namespace app-example --tail 5
10.42.0.6 - - [10/Sep/2022:11:58:32 +0000] "GET /healthz HTTP/1.1" 200 0 "-" "Blackbox Exporter/0.22.0" "-"
10.42.0.6 - - [10/Sep/2022:11:58:37 +0000] "GET /healthz HTTP/1.1" 200 0 "-" "Blackbox Exporter/0.22.0" "-"
10.42.0.6 - - [10/Sep/2022:11:58:42 +0000] "GET /healthz HTTP/1.1" 200 0 "-" "Blackbox Exporter/0.22.0" "-"
10.42.0.6 - - [10/Sep/2022:11:58:47 +0000] "GET /healthz HTTP/1.1" 200 0 "-" "Blackbox Exporter/0.22.0" "-"
10.42.0.6 - - [10/Sep/2022:11:58:52 +0000] "GET /healthz HTTP/1.1" 200 0 "-" "Blackbox Exporter/0.22.0" "-"
```

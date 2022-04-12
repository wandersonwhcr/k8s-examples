# prometheus

This example creates a cluster with 1 server and 3 agents (4 nodes) and installs
Prometheus to scrape metrics from nodes, services and pods with label
`prometheus.io/scrape` equals to `true`.

```
k3d cluster create example \
    --servers 1 \
    --agents 3 \
    --no-lb

kubectl apply \
    --kustomize .

kubectl port-forward service/prometheus 8080:80 \
    --namespace prometheus
```

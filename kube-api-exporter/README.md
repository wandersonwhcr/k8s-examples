# kube-api-exporter

This example shows how to use Prometheus JSON Exporter to scrap Kubernetes API,
retrieving metrics from deployments replicas value.

**DISCLAIMER** This example must not be used to scrape default Kubernetes
resources and it is a proof of concept. Please, use
[kube-state-metrics](https://github.com/kubernetes/kube-state-metrics) to
retrieve these values. On the other hand, KSM does not scrape custom resources
and at the end, this example can be useful on this case.

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

It installs a JSON Exporter called `kube-api-exporter` with a configured module
`deployment` that uses JSONPath to capture Deployment replicas value. Also, it
is configured with `ca.crt` and `token` from Service Account, related with a
Cluster Role that allows Deployment listing on Kubernetes API.

A Probe resource configures Prometheus to execute requests on this JSON Exporter
using Kubernetes API Deployment endpoint as target and `deployment` module.

After this, Prometheus API can be used to retrieve
`kube_api_exporter_deployment_replicas` metric to show replicas values over
time.

```
curl http://localhost:9090/api/v1/query \
    --silent --fail \
    --get \
    --data 'query=kube_api_exporter_deployment_replicas{name="kube-api-exporter"}' \
    --data "time=`date +%s`"
```

```json
{
  "status": "success",
  "data": {
    "resultType": "vector",
    "result": [
      {
        "metric": {
          "__name__": "kube_api_exporter_deployment_replicas",
          "exported_namespace": "kube-api-exporter",
          "instance": "https://kubernetes.default.svc/apis/apps/v1/deployments",
          "job": "probe/kube-api-exporter/kube-api-exporter-deployment",
          "name": "kube-api-exporter",
          "namespace": "kube-api-exporter"
        },
        "value": [
          1663329213,
          "1"
        ]
      }
    ]
  }
}
```

## References

* [Prometheus Community JSON Exporter](https://github.com/prometheus-community/json_exporter)
* [JSON Exporter Examples](https://github.com/prometheus-community/json_exporter/tree/master/examples)
* [JSON Exporter Config Metric Value Type](https://github.com/prometheus-community/json_exporter/blob/master/test/config/good.yml)

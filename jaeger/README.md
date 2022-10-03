# jaeger

```sh
k3d cluster create \
    --config ../k3d-example.yaml

kubectl apply \
    --filename https://github.com/cert-manager/cert-manager/releases/download/v1.8.2/cert-manager.yaml

kubectl apply \
    --kustomize ../opentelemetry/opentelemetry-operator

kubectl create \
    --kustomize ../prometheus/prometheus-operator

kubectl apply \
    --kustomize ../prometheus

kubectl apply \
    --kustomize ./jaeger-operator

kubectl apply \
    --kustomize ./
```

```sh
kubectl apply \
    --kustomize ../mongodb

for APPLICATION in app-music app-artists app-albums; do
    docker build "../microservices/$APPLICATION/src" \
        --tag "k3d-example-registry:5000/$APPLICATION"
    docker push "k3d-example-registry:5000/$APPLICATION"
done

kubectl apply \
    --kustomize ./app-artists

kubectl apply \
    --kustomize ./app-albums

kubectl apply \
    --kustomize ./app-music
```

```sh
../microservices/create-resources.sh
```

## References

* [OpenTelemetry Contrib Collector Jaeger Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/jaegerexporter)
* [OpenTelemetry Contrib Collector Span Metrics Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/spanmetricsprocessor)
* [OpenTelemetry Contrib Collector Prometheus Exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/prometheusexporter)

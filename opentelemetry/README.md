# opentelemetry

```sh
k3d cluster create \
    --config ../k3d-example.yaml

kubectl apply \
    --filename https://github.com/cert-manager/cert-manager/releases/download/v1.8.2/cert-manager.yaml

kubectl apply \
    --kustomize ./opentelemetry-operator

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

## References

* [OpenTelemetry Collector OTLP Receiver](https://github.com/open-telemetry/opentelemetry-collector/tree/main/receiver/otlpreceiver)
* [OpenTelemetry Collector Logging Exporter](https://github.com/open-telemetry/opentelemetry-collector/tree/main/exporter/loggingexporter)
* [Error Updating Container Image Version](https://github.com/open-telemetry/opentelemetry-operator/issues/1107)

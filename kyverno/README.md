# kyverno

This example shows how to use Kyverno, a policy engine to validate, mutate and
generate resources on Kubernetes.

Basically, this example installs policies over `app-example` namespace, to
generate a configmap automatically with database configuration, to validate if
pod containers use image tags different from latest and if environment variables
use only uppercase and underscore characteres, and to mutate pods adding a label
describing the environment.

```
k3d cluster create \
    --config ../k3d-example.yaml

kubectl apply \
    --filename https://raw.githubusercontent.com/kyverno/kyverno/release-1.7/config/release/install.yaml

kubectl apply \
    --filename ./clusterpolicies
```

After, an `app-example` with a deployment must be created.

```
kubectl apply \
    --kustomize ./app-example
```

Kyverno will apply policies as defined.

```
kubectl get configmap database-config \
    --namespace app-example \
    --output json \
    | jq '.data'

{
  "address": "mysql.example.tld"
}
```

```
kubectl get pods \
    --namespace app-example \
    --output json \
    | jq '.items[].spec.containers[].image'

"nginx:1.23"
```

```
kubectl get pods \
    --namespace app-example \
    --output json \
    | jq '.items[].spec.containers[].env[]'

{
  "name": "APP_NAME",
  "value": "app-example-success"
}
{
  "name": "DATABASE_ADDRESS",
  "valueFrom": {
    "configMapKeyRef": {
      "key": "address",
      "name": "database-config"
    }
  }
}
```

```
kubectl get pods \
    --namespace app-example \
    --output json \
    | jq '.items[].metadata.labels'

{
  "app.kubernetes.io/environment": "testing",
  "app.kubernetes.io/name": "app-example",
  "pod-template-hash": "748c5bf658"
}
```

## References

* [Kyverno](https://kyverno.io/docs/)
* [Kyverno JMESPath Regex Match](https://kyverno.io/docs/writing-policies/jmespath/#regex_match)
* [Kyverno Disallow Latest Tag](https://kyverno.io/policies/best-practices/disallow_latest_tag/disallow_latest_tag/)
* [JMESPath Specification](https://jmespath.org/specification.html)

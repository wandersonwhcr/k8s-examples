# kyverno

This example shows how to use Kyverno, a policy engine to validate, mutate and
generate resources on Kubernetes.

Basically, this example installs cluster policies over `app-example` namespace,
to generate a configmap automatically with database configuration, to validate
if pod containers use image tags different from latest and if environment
variables use only uppercase and underscore chars, and to mutate pods adding a
label describing the environment.

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

Kyverno will apply policies as defined and values can be fetch using these
commands:

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

Kyverno validations can be check changing resources like these examples:

```
kubectl set image \
    deployment/app-example webserver=nginx \
    --namespace app-example

error: failed to patch image update to pod template: admission webhook "validate.kyverno.svc-fail" denied the request:

resource Deployment/app-example/app-example was blocked due to the following policies

validate-pods:
  autogen-image-tag: 'validation error: Container Image must have a tag. Rule autogen-image-tag
    failed at path /spec/template/spec/containers/0/image/'
```

```
kubectl set image \
    deployment/app-example webserver=nginx:latest \
    --namespace app-example

error: failed to patch image update to pod template: admission webhook "validate.kyverno.svc-fail" denied the request:

resource Deployment/app-example/app-example was blocked due to the following policies

validate-pods:
  autogen-image-tag-not-latest: 'validation error: Container Image Tag must not be
    equal to "latest". Rule autogen-image-tag-not-latest failed at path /spec/template/spec/containers/0/image/'
```

```
kubectl patch \
    deployment app-example \
    --namespace app-example \
    --type json \
    --patch-file patch-deployment.yaml

Error from server: admission webhook "validate.kyverno.svc-fail" denied the request:

resource Deployment/app-example/app-example was blocked due to the following policies

validate-pods:
  autogen-env-name-uppercase-underscore: Environment Variables must have only uppercase
    and underscore characters
```

## References

* [Kyverno](https://kyverno.io/docs/)
* [Kyverno JMESPath Regex Match](https://kyverno.io/docs/writing-policies/jmespath/#regex_match)
* [Kyverno Disallow Latest Tag](https://kyverno.io/policies/best-practices/disallow_latest_tag/disallow_latest_tag/)
* [JMESPath Specification](https://jmespath.org/specification.html)

# kyverno

```
k3d cluster create \
    --config ../k3d-example.yaml

kubectl apply \
    --filename https://raw.githubusercontent.com/kyverno/kyverno/release-1.7/config/release/install.yaml

kubectl apply \
    --filename ./clusterpolicies
```

```
kubectl apply \
    --kustomize ./app-example-success
```

## References

* [Kyverno](https://kyverno.io/docs/)
* [Kyverno JMESPath Regex Match](https://kyverno.io/docs/writing-policies/jmespath/#regex_match)
* [Kyverno Disallow Latest Tag](https://kyverno.io/policies/best-practices/disallow_latest_tag/disallow_latest_tag/)
* [JMESPath Specification](https://jmespath.org/specification.html)

# kyverno

```
k3d cluster create \
    --config ../k3d-example.yaml

kubectl apply \
    --filename https://raw.githubusercontent.com/kyverno/kyverno/release-1.7/config/release/install.yaml
```

## References

* [Kyverno](https://kyverno.io/docs/)
* [Kyverno JMESPath Regex Match](https://kyverno.io/docs/writing-policies/jmespath/#regex_match)

# fluent-bit

```
k3d cluster create \
    --config ../k3d-example.yaml

kubectl apply \
    --kustomize .
```

## References

* [Fluent Bit for Kubernetes](https://github.com/fluent/fluent-bit-kubernetes-logging)
* [Configuration File](https://docs.fluentbit.io/manual/administration/configuring-fluent-bit/classic-mode/configuration-file)
* [Input: Tail](https://docs.fluentbit.io/manual/pipeline/inputs/tail)
* [Filter: Kubernetes](https://docs.fluentbit.io/manual/pipeline/filters/kubernetes)
* [Output: Standard Output](https://docs.fluentbit.io/manual/pipeline/outputs/standard-output)
* [Parser: Regular Expression](https://docs.fluentbit.io/manual/pipeline/parsers/regular-expression)

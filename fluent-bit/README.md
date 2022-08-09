# fluent-bit

This example shows how to use Fluent Bit to collect logs from containers running
on Kubernetes nodes.

Fluent Bit is installed as a `DaemonSet` to run one pod per node. Each pod
receives a volume mount from `/var/log` of node to access containers logs. A
`tail` input plugin fetches these logs and keep tracking of consuming using a
database saved on node. To enrich messages, `kubernetes` filter plugin retrieve
information about the pod. Collected logs are sent to fluent bit standard output
using `stdout` output plugin.

```
k3d cluster create \
    --config ../k3d-example.yaml

kubectl apply \
    --kustomize .
```

An example application that generates a JSON with a random hash on standard
output can be installed. Results can be retrieved checking fluent bit stdout.

```
kubectl apply \
    --kustomize ./app-example

kubectl get pods \
    --namespace fluent-bit \
    --selector app.kubernetes.io/name=fluent-bit \
    --field-selector spec.nodeName=k3d-example-agent-0 \
    --output name \
    | xargs kubectl logs \
        --namespace fluent-bit \
        --tail 1 \
    | jq
```

```json
[
  {
    "date": 1660044906.234648,
    "stream": "stdout",
    "logtag": "F",
    "message": "{\"hash\":\"0ac671f0dbb90973c3763ac2826c03d0f8f65c7c\"}",
    "kubernetes": {
      "pod_name": "app-example-547cd6947-rtwf4",
      "namespace_name": "app-example",
      "pod_id": "ffa5bd27-999b-464b-910a-3e9968531940",
      "labels": {
        "app.kubernetes.io/name": "app-example",
        "pod-template-hash": "547cd6947"
      },
      "annotations": {
        "kubectl.kubernetes.io/restartedAt": "2022-08-09T08:06:18-03:00"
      },
      "host": "k3d-example-agent-0",
      "container_name": "alpine",
      "docker_id": "1e73bbe76205002f48c56b636a816e55cf91b648575f20cd8245b0801a9a3947",
      "container_hash": "docker.io/library/alpine@sha256:7580ece7963bfa863801466c0a488f11c86f85d9988051a9f9c68cb27f6b7872",
      "container_image": "docker.io/library/alpine:3.16"
    }
  }
]
```

## References

* [Fluent Bit for Kubernetes](https://github.com/fluent/fluent-bit-kubernetes-logging)
* [Configuration File](https://docs.fluentbit.io/manual/administration/configuring-fluent-bit/classic-mode/configuration-file)
* [Input: Tail](https://docs.fluentbit.io/manual/pipeline/inputs/tail)
* [Filter: Kubernetes](https://docs.fluentbit.io/manual/pipeline/filters/kubernetes)
* [Output: Standard Output](https://docs.fluentbit.io/manual/pipeline/outputs/standard-output)
* [Parser: Regular Expression](https://docs.fluentbit.io/manual/pipeline/parsers/regular-expression)

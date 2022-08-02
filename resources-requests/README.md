# resources-requests

```console
$ k3d cluster create \
    --config ../k3d-example.yaml

$ k3d node create example-agent-resources \
    --cluster example \
    --replicas 2 \
    --memory 1G \
    --role agent \
    --k3s-arg --node-taint=node.kubernetes.io/example=resources:NoSchedule
```

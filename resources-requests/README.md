# resources-requests

```console
$ k3d cluster create \
    --config ../k3d-example.yaml

$ KUBE_RESERVED_CPU=`grep '^processor' /proc/cpuinfo | wc -l | awk '{ print $0 - 1 }'`

$ k3d node create example-agent-resources \
    --cluster example \
    --replicas 2 \
    --k3s-arg "--kubelet-arg=--kube-reserved=cpu=${KUBE_RESERVED_CPU}" \
    --memory 1G \
    --role agent \
    --k3s-node-label node.kubernetes.io/example=resources \
    --k3s-arg '--node-taint=node.kubernetes.io/example=resources:NoSchedule'

$ kubectl apply \
    --kustomize .
```

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

```console
$ kubectl get pods \
    --namespace resources-requests \
    --sort-by metadata.name
NAME                                         READY   STATUS    RESTARTS   AGE
resources-requests-cpu-558566dcdd-bl7v2      1/1     Running   0          64s
resources-requests-cpu-558566dcdd-cghp5      0/1     Pending   0          64s
resources-requests-cpu-558566dcdd-rvjbx      1/1     Running   0          64s
resources-requests-memory-66db67668b-f2w6d   0/1     Pending   0          64s
resources-requests-memory-66db67668b-kshvj   1/1     Running   0          64s
resources-requests-memory-66db67668b-r2w28   1/1     Running   0          64s
```

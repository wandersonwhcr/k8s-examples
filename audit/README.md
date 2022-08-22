# audit

This example shows how to audit changes on Kubernetes configuring the cluster to
save files in JSONlines format in a volume defined via k3d.

```
k3d cluster create \
    --config ../k3d-example.yaml \
    --k3s-arg '--kube-apiserver-arg=audit-policy-file=/etc/kubernetes/audit/policy.yaml@server:*' \
    --k3s-arg '--kube-apiserver-arg=audit-log-path=/var/log/kubernetes/audit/audit.log@server:*' \
    --volume "`pwd`/volumes/server/etc/kubernetes/audit/policy.yaml:/etc/kubernetes/audit/policy.yaml:ro@server:*" \
    --volume "`pwd`/volumes/server/var/log/kubernetes/audit:/var/log/kubernetes/audit@server:*"
```

The file `policy.yaml` contains a resource of kind `Policy` that configures the
cluster to register metadata changes from pods. These changes can be read as
defined:

```console
$ kubectl get pods --all-namespaces
NAMESPACE     NAME                                      READY   STATUS      RESTARTS   AGE
kube-system   local-path-provisioner-6c79684f77-qcs7g   1/1     Running     0          15m
kube-system   coredns-d76bd69b-2s5hd                    1/1     Running     0          15m
kube-system   helm-install-traefik-crd-k2rtc            0/1     Completed   0          15m
kube-system   helm-install-traefik-pqzfr                0/1     Completed   0          15m
kube-system   svclb-traefik-lfkp6                       2/2     Running     0          15m
kube-system   svclb-traefik-mphwt                       2/2     Running     0          15m
kube-system   svclb-traefik-8pcf6                       2/2     Running     0          15m
kube-system   svclb-traefik-c7b7x                       2/2     Running     0          15m
kube-system   metrics-server-7cd5fcb6b7-7zpkb           1/1     Running     0          15m
kube-system   traefik-df4ff85d6-6b8t6                   1/1     Running     0          15m

$ sudo tail --lines 1 ./volumes/server/var/log/kubernetes/audit/audit.log | jq
{
  "kind": "Event",
  "apiVersion": "audit.k8s.io/v1",
  "level": "Metadata",
  "auditID": "c31e4b3f-ebf1-4a7f-a560-5359cd62bc33",
  "stage": "ResponseComplete",
  "requestURI": "/api/v1/pods?limit=500",
  "verb": "list",
  "user": {
    "username": "system:admin",
    "groups": [
      "system:masters",
      "system:authenticated"
    ]
  },
  "sourceIPs": [
    "172.18.0.7"
  ],
  "userAgent": "kubectl/v1.23.3 (linux/amd64) kubernetes/816c97a",
  "objectRef": {
    "resource": "pods",
    "apiVersion": "v1"
  },
  "responseStatus": {
    "metadata": {},
    "code": 200
  },
  "requestReceivedTimestamp": "2022-08-22T10:06:47.156664Z",
  "stageTimestamp": "2022-08-22T10:06:47.161729Z",
  "annotations": {
    "authorization.k8s.io/decision": "allow",
    "authorization.k8s.io/reason": ""
  }
}
```

## References

* [Auditing](https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/)
* [Kubernetes Audit Logs by ContainIQ](https://www.containiq.com/post/kubernetes-audit-logs)
* [Audit Policy](https://cloud.google.com/kubernetes-engine/docs/concepts/audit-policy)

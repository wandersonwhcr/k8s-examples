# audit

```
k3d cluster create \
    --config ../k3d-example.yaml \
    --k3s-arg '--kube-apiserver-arg=audit-policy-file=/etc/kubernetes/audit/policy.yaml@server:*' \
    --k3s-arg '--kube-apiserver-arg=audit-log-path=/var/log/kubernetes/audit/audit.log@server:*' \
    --volume "`pwd`/volumes/server/etc/kubernetes/audit/policy.yaml:/etc/kubernetes/audit/policy.yaml:ro@server:*" \
    --volume "`pwd`/volumes/server/var/log/kubernetes/audit:/var/log/kubernetes/audit@server:*"
```

## References

* [Auditing](https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/)
* [Kubernetes Audit Logs by ContainIQ](https://www.containiq.com/post/kubernetes-audit-logs)
* [Audit Policy](https://cloud.google.com/kubernetes-engine/docs/concepts/audit-policy)

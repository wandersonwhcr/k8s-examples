# audit

```
k3d cluster create \
    --config ../k3d-example.yaml \
    --k3s-arg '--kube-apiserver-arg=audit-log-path=/var/log/kubernetes/audit.log@server:*' \
    --volume "`pwd`/volumes/var/log:/var/log/kubernetes@server:*"
```

## References

* [Auditing](https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/)
* [Kubernetes Audit Logs by ContainIQ](https://www.containiq.com/post/kubernetes-audit-logs)
* [Audit Policy](https://cloud.google.com/kubernetes-engine/docs/concepts/audit-policy)

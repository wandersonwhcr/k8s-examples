# network-policy

This example creates network policies to allow and deny requests between pods.
Installed Kubernetes Container Network Interface (CNI) must handle
`NetworkPolicy` resources to configure these permissions. k3d (k3s) uses Flannel
CNI by default and it reads these definitions.

```
k3d cluster create \
    --config ../k3d-example.yaml
```

```
kubectl apply \
    --kustomize ./app-service

kubectl apply \
    --kustomize ./app-proxy

kubectl apply \
    --kustomize ./app-checker
```

```
kubectl get pods \
    --namespace app-checker \
    --sort-by metadata.name

NAME                                       READY   STATUS      RESTARTS   AGE
app-checker-service-a-js4dk                0/1     Completed   0          26s
app-checker-service-a-status-2jsp8         0/1     Completed   0          26s
app-checker-service-a-status-error-8btnn   0/1     Completed   0          26s
app-checker-service-b-5z9rx                0/1     Completed   0          26s
```

```
kubectl logs \
    --namespace app-checker \
    jobs/app-checker-proxy

[Sun, 07 Aug 2022 15:47:35 +0000] Proxy -> Service
HTTP/1.1 200 OK
Server: nginx/1.23.1
Date: Sun, 07 Aug 2022 15:47:35 GMT
Content-Type: application/json
Content-Length: 61
Connection: keep-alive
App-Proxy: app-proxy-65555dc65f-d5sks

{"app": "service", "hostname": "app-service-69f89769d-ntj9f"}
```

```
kubectl logs \
    --namespace app-checker \
    jobs/app-checker-proxy-status

[Sun, 07 Aug 2022 15:47:35 +0000] Proxy:Status
HTTP/1.1 200 OK
Server: nginx/1.23.1
Date: Sun, 07 Aug 2022 15:47:35 GMT
Content-Type: text/plain
Content-Length: 97
Connection: keep-alive

Active connections: 1 
server accepts handled requests
 1 1 1 
Reading: 0 Writing: 1 Waiting: 0 
```

```
kubectl logs \
    --namespace app-checker \
    jobs/app-checker-proxy-status-error

[Sun, 07 Aug 2022 15:47:35 +0000] Proxy:Status
[Sun, 07 Aug 2022 15:47:35 +0000] Proxy:Status Failed to Connect
```

```
kubectl logs \
    --namespace app-checker \
    jobs/app-checker-service

[Sun, 07 Aug 2022 15:47:35 +0000] Service
[Sun, 07 Aug 2022 15:47:35 +0000] Service Failed to Connect
```

## References

* [k3s Flannel Network Options](https://rancher.com/docs/k3s/latest/en/installation/network-options/)
* [Flannel](https://github.com/flannel-io/flannel)
* [Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/)

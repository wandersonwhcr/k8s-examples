# kong

```
k3d cluster create \
    --config ../k3d-example.yaml \
    --k3s-arg --no-deploy=traefik@server:*

kubectl apply \
    --filename https://raw.githubusercontent.com/Kong/kubernetes-ingress-controller/master/deploy/single/all-in-one-dbless.yaml

kubectl annotate \
    ingressclass kong \
    ingressclass.kubernetes.io/is-default-class=true

kubectl apply \
    --kustomize ./app-example
```

```
curl http://app-example.app-example.localhost \
    --head --silent \
    --resolve app-example.app-example.localhost:80:127.0.0.1
```

```
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Length: 615
Connection: keep-alive
Server: nginx/1.23.1
Date: Wed, 10 Aug 2022 10:38:10 GMT
Last-Modified: Tue, 19 Jul 2022 14:05:27 GMT
ETag: "62d6ba27-267"
Accept-Ranges: bytes
X-Kong-Upstream-Latency: 0
X-Kong-Proxy-Latency: 0
Via: kong/2.8.1
```

## References

* [Installing and Configuring](https://docs.konghq.com/kubernetes-ingress-controller/2.5.x/deployment/overview/)

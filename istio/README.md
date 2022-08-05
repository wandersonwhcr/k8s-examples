# istio

## Install

```
k3d cluster create \
    --config ../k3d-example.yaml \
    --k3s-arg --no-deploy=traefik@server:*

istioctl install \
    --skip-confirmation \
    --set profile=demo
```

## Ingress Class

```
kubectl apply \
    --filename ingressclass.yaml
```

## Example

```
kubectl apply \
    --kustomize ./app-example
```

```
curl http://app-example.app-example.localhost \
    --head \
    --resolve app-example.app-example.localhost:80:127.0.0.1
```

```
HTTP/1.1 200 OK
server: istio-envoy
date: Thu, 04 Aug 2022 01:41:36 GMT
content-type: text/html
content-length: 615
last-modified: Tue, 19 Jul 2022 14:05:27 GMT
etag: "62d6ba27-267"
accept-ranges: bytes
x-envoy-upstream-service-time: 0
```

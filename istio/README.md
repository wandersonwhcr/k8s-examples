# istio

This example shows how to install Istio on k3d Kubernetes cluster with demo
profile. Also, there is an example of Ingress Class with Istio that is not
installed by default.

## Install

```
k3d cluster create \
    --config ../k3d-example.yaml \
    --k3s-arg --no-deploy=traefik@server:*

istioctl install \
    --skip-confirmation \
    --set profile=demo
```

### Ingress Class

```
kubectl apply \
    --filename ingressclass.yaml
```

## Example

An example application can be deployed to test Istio. The `Namespace` must be
created with label `istio-injection` to automatically run `istio-envoy` sidecar.

```
kubectl apply \
    --kustomize ./app-example
```

Make a request with `curl` to check if this application is running.

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

## Addons

Some addons can be installed with Istio to improve observability. Kiali is a
dashboard to manage Istio. Kiali uses Prometheus to retrieve metrics and display
network traffic and service dependencies.

```
kubectl apply \
    --filename https://raw.githubusercontent.com/istio/istio/1.14.3/samples/addons/prometheus.yaml

kubectl apply \
    --filename https://raw.githubusercontent.com/istio/istio/1.14.3/samples/addons/kiali.yaml
```

Use port forward to access Kiali dashboard and execute a sequence of requests to
visualize the cluster topology.

```
kubectl port-forward \
    service/kiali http \
    --namespace istio-system
```

```sh
for I in `seq 1 100`; do
    curl http://app-example.app-example.localhost \
        --silent \
        --resolve app-example.app-example.localhost:80:127.0.0.1 \
        > /dev/null
done
```

## References

* [Istio Service Mesh](https://istio.io/)
* [Install Istio with istioctl](https://istio.io/latest/docs/setup/install/istioctl/)
* [Specifying IngressClass](https://istio.io/latest/docs/tasks/traffic-management/ingress/kubernetes-ingress/#specifying-ingressclass)
* [Kiali Management Console for Istio](https://kiali.io/)

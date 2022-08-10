# kong

This example shows how to install and use Kong Ingress Controller, configuring
created `IngressClass` as default and installing an example application.

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

`app-example` is a deployment with pods running Nginx containers. It uses 3 Kong
plugins: `correlation-id` to create a header `X-Request-Id` and trace requests
on cluster, `basic-auth` to force authentication on edge and `rate-limiting` to
limit requests by IP. These plugins are installed via annotations on `Ingress`,
but the last one is on `Service` to allow any ingress that uses it to configure
rate limiting. Kong plugins installed on service level don't change internal
cluster requests; they will only work on Kong Ingress Controller.

```
curl http://app-example.app-example.localhost \
    --head --silent \
    --user john.doe:my-password \
    --resolve app-example.app-example.localhost:80:127.0.0.1
```

```
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Length: 615
Connection: keep-alive
X-RateLimit-Remaining-Minute: 9
X-RateLimit-Limit-Minute: 10
RateLimit-Remaining: 9
RateLimit-Limit: 10
RateLimit-Reset: 57
Server: nginx/1.23.1
Date: Wed, 10 Aug 2022 11:43:03 GMT
Last-Modified: Tue, 19 Jul 2022 14:05:27 GMT
ETag: "62d6ba27-267"
Accept-Ranges: bytes
X-Request-Id: 3cb34922-a5a9-4545-873b-65ee9fad1ec0#47
X-Kong-Upstream-Latency: 0
X-Kong-Proxy-Latency: 1
Via: kong/2.8.1
```

## References

* [Installing and Configuring](https://docs.konghq.com/kubernetes-ingress-controller/2.5.x/deployment/overview/)
* [Provisioning Consumers and Credentials](https://docs.konghq.com/kubernetes-ingress-controller/latest/guides/using-consumer-credential-resource/)

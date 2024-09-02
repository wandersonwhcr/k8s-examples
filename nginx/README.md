# nginx

This example shows how to run nginx as a non root, unprivileged used.

First, create a Kubernetes cluster.

```
k3d cluster create \
    --config ./k3d-example.yaml
```

After, apply resources on the cluster, where nginx pods are created via
deployment `nginx` on namespace `nginx`. Also, a service `nginx` is created on
the same namespace and a ingress `nginx` is configured to use this service.

```
kubectl apply \
    --kustomize ./

kubectl rollout status deployment/nginx \
    --namespace nginx \
    --timeout 600s
```

Check if the webserver is up and running using external requests via curl.

```
curl http://nginx.nginx.example \
    --resolve nginx.nginx.example:80:127.0.0.1 \
    --verbose
```

```
* Added nginx.nginx.example:80:127.0.0.1 to DNS cache
* Hostname nginx.nginx.example was found in DNS cache
*   Trying 127.0.0.1:80...
* Connected to nginx.nginx.example (127.0.0.1) port 80 (#0)
> GET / HTTP/1.1
> Host: nginx.nginx.example
> User-Agent: curl/7.81.0
> Accept: */*
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< Content-Length: 39
< Content-Type: application/json
< Date: Mon, 02 Sep 2024 02:17:51 GMT
< Server: nginx/1.26.2
<
{"hostname": "nginx-5c5f6cfc44-cwtrl"}
* Connection #0 to host nginx.nginx.example left intact
```

## References

* [nginx](https://nginx.org/)
* [Unprivileged NGINX Dockerfiles](https://github.com/nginxinc/docker-nginx-unprivileged)

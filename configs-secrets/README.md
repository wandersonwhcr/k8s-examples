# configs-secrets

This example shows how to use `ConfigMap` and `Secret` with `Deployment`
injected as environment variables or volumes.

```
k3d cluster create example

kubectl apply \
    --kustomize .
```

```console
$ kubectl exec deployment/example -- env | grep ^APP_
APP_PORT=3000
APP_TOKEN=8843d7f92416211de9ebb963ff4ce28125932878
APP_DEBUG=true
APP_ENV=staging
APP_NAME=example
```

```console
$ curl --include --user foobar:bazqux http://example
HTTP/1.1 200 OK
Server: nginx/1.21.6
Date: Tue, 21 Jun 2022 00:02:47 GMT
Content-Type: application/json
Content-Length: 18
Connection: keep-alive

{"name":"example"}
```

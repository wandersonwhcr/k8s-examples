# canary

```
k3d cluster create \
    --config ../k3d-example.yaml \
    --k3s-arg --no-deploy=traefik@server:*

istioctl install \
    --skip-confirmation \
    --set profile=demo
```

```
kubectl apply \
    --kustomize .
```

```
for I in `seq 1 100`; do
    curl http://app-example.app-example.localhost \
        --silent \
        --resolve app-example.app-example.localhost:80:127.0.0.1
done \
    | jq --raw-output .subset \
    | sort --numeric-sort \
    | uniq --count
```

```
kubectl patch \
    virtualservice app-example \
    --type json \
    --patch-file patch-canary-50.yaml

kubectl patch \
    virtualservice app-example \
    --type json \
    --patch-file patch-canary-100.yaml
```

* Kubernetes `Ingress` has priority over Istio `Gateway`.

# kong

```
k3d cluster create \
    --config ../k3d-example.yaml \
    --k3s-arg --no-deploy=traefik@server:*

kubectl apply \
    --filename https://raw.githubusercontent.com/Kong/kubernetes-ingress-controller/master/deploy/single/all-in-one-dbless.yaml
```

## References

* [Installing and Configuring](https://docs.konghq.com/kubernetes-ingress-controller/2.5.x/deployment/overview/)

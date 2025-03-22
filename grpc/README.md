# grpc

```
k3d cluster create \
    --config ../k3d-example.yaml
```

```
kubectl apply \
    --kustomize ./grpc-hostname-server
```

```
kubectl apply \
    --kustomize ./grpc-hostname-client
```

## References

* [gRPC: Load Balancing](https://github.com/grpc/grpc-go/tree/b0d120384670bde5a2fa830d65e43b250c24d8fd/examples/features/load_balancing)

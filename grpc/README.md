# grpc

This example shows how to load balancing gRPC requests using Kubernetes.

First, create our example cluster.

```
k3d cluster create \
    --config ../k3d-example.yaml
```

Now, create a gRPC server that receives requests and responds with its hostname.

```
kubectl apply \
    --kustomize ./grpc-hostname-server

kubectl rollout status deployment/grpc-hostname-server \
    --namespace grpc-hostname-server \
    --timeout 600s
```

After, create a gRPC client that connects to server and requests its hostname,
printing client and server hostnames on standard output.

```
kubectl apply \
    --kustomize ./grpc-hostname-client

kubectl rollout status deployment/grpc-hostname-client \
    --namespace grpc-hostname-client \
    --timeout 600s
```

Check client logs.

```
kubectl logs \
    --selector app=grpc-hostname-client \
    --namespace grpc-hostname-client
```

```
2025/03/22 18:32:53 Client: grpc-hostname-client-5bd7777d44-9s5nd, Server: grpc-hostname-server-5d8446889b-mtg9g
2025/03/22 18:32:55 Client: grpc-hostname-client-5bd7777d44-9s5nd, Server: grpc-hostname-server-5d8446889b-86f57
2025/03/22 18:32:57 Client: grpc-hostname-client-5bd7777d44-9s5nd, Server: grpc-hostname-server-5d8446889b-6fnpn
2025/03/22 18:32:59 Client: grpc-hostname-client-5bd7777d44-9s5nd, Server: grpc-hostname-server-5d8446889b-mtg9g
2025/03/22 18:33:01 Client: grpc-hostname-client-5bd7777d44-9s5nd, Server: grpc-hostname-server-5d8446889b-86f57
2025/03/22 18:33:03 Client: grpc-hostname-client-5bd7777d44-9s5nd, Server: grpc-hostname-server-5d8446889b-6fnpn
```

## How?

This behavior occurs because the `grpc-hostname-server` service is configured as
headless. When a client resolves the server address, it retrieves all pod IPs
directly, rather than a single cluster IP.

```
$ grep -rn --context 2 clusterIP
grpc-hostname-server/service.yaml-4-  name: grpc-hostname-server
grpc-hostname-server/service.yaml-5-spec:
grpc-hostname-server/service.yaml:6:  clusterIP: None
grpc-hostname-server/service.yaml-7-  selector:
grpc-hostname-server/service.yaml-8-    app: grpc-hostname-server
```

Subsequently, the `grpc-hostname-client` is configured in its source code to
load balance requests using a round-robin algorithm with all resolved IPs.

```
$ grep -rn --context 3 loadBalancingConfig
client/main.go-20-	conn, err := grpc.NewClient(
client/main.go-21-		os.Getenv("HOSTNAME_SERVER_ADDR"),
client/main.go-22-		grpc.WithInsecure(),
client/main.go:23:		grpc.WithDefaultServiceConfig(`{"loadBalancingConfig":[{"round_robin":{}}]}`),
client/main.go-24-	)
client/main.go-25-
client/main.go-26-	if err != nil {
```

## References

* [grpc-hostname: A Simple gRPC Toy Server to Retrieve Hostnames](https://github.com/wandersonwhcr/grpc-hostname)
* [gRPC: Load Balancing](https://github.com/grpc/grpc-go/tree/b0d120384670bde5a2fa830d65e43b250c24d8fd/examples/features/load_balancing)

# rabbitmq

This example shows how to deploy a RabbitMQ Cluster via Cluster Operator, adding
three separate Kubernetes nodes to deploy RabbitMQ using taint and affinity.
Also, it installs and shows how to use Topology Operator to provision RabbitMQ
resources using Kubernetes CRD. Cert Manager is installed because Topology
Operator depends on it.

```
k3d cluster create \
    --config ../k3d-example.yaml \
    && sleep 2 \
    && k3d node create example-agent-rabbitmq \
        --cluster example \
        --replicas 3 \
        --memory 1G \
        --role agent \
        --k3s-arg --node-taint=node.kubernetes.io/broker=rabbitmq:NoSchedule

# RabbitMQ Cluster Kubernetes Operator
kubectl apply \
    --filename https://github.com/rabbitmq/cluster-operator/releases/download/v1.14.0/cluster-operator.yml

# Certificate Manager for Topology Operator
kubectl apply \
    --filename https://github.com/cert-manager/cert-manager/releases/download/v1.8.2/cert-manager.yaml

# RabbitMQ Messaging Topology Operator
kubectl apply \
    --filename https://github.com/rabbitmq/messaging-topology-operator/releases/download/v1.7.1/messaging-topology-operator-with-certmanager.yaml
```

## Producer-Consumer Example

Two projects were developed to show how to use Topology Operator, using a
producer-consumer pattern to calculate the factorial of a number.

`app-factorial-api` is a RESTful API that provides two endpoints: one receives a
number and responds with a new location and another corresponds to this new
location to retrieve the factorial of number. API produces messages on RabbitMQ
for async processing and retrieves results calculated on a bucket using MinIO.

`app-factorial-worker` is a consumer worker for RabbitMQ that computes factorial
of a number and stores its results on the same bucket.

Use Docker to build and push these container images to cluster registry.

```
docker build ./src/app-factorial-api \
    --tag k3d-example-registry:5000/app-factorial-api

docker push k3d-example-registry:5000/app-factorial-api

docker build ./src/app-factorial-worker \
    --tag k3d-example-registry:5000/app-factorial-worker

docker push k3d-example-registry:5000/app-factorial-worker
```

## Deployment

Resources are available using Kustomize and must be applied using this command.

```
kubectl apply \
    --kustomize .
```

Every RabbitMQ resource is defined in `resources` directory using Topology
Operator. `app-factorial-api` subdirectory contains user and permission to
access this broker from service and an exchange to receive messages from
publisher. `app-factorial-worker` subdirectory also defines a user and
permission for worker, a queue for messages, a binding to link the exchange and
queue, and a policy for queue.

```mermaid
flowchart LR
    app-factorial-api --> exchange[Exchange: app-factorial-api]
    subgraph RabbitMQ
        exchange -->|Binding: app-factorial-worker| queue[Queue: app-factorial-worker]
    end
    queue --> app-factorial-worker
```

## Testing

This snipped shows how to calculate the factorial of 10.

```
./src/app-factorial-api/factorial.sh 10
```

## Notes

If `USER-user-credentials` exists, `User` resource will be not created and
Kubernetes does not show error messages.

### Topology Dependencies

```mermaid
flowchart BT
    Permission --> User
    Permission --> Vhost
    Queue --> Vhost
    Exchange --> Vhost
    Policy --> Queue
    Binding --> Queue
    Binding --> Exchange
```

## References

* [RabbitMQ: Using Topology Operator](https://www.rabbitmq.com/kubernetes/operator/using-topology-operator.html)

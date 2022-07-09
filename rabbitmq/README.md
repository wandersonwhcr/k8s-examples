# rabbitmq

```
k3d cluster create \
    --config ../k3d-example.yaml

# RabbitMQ Cluster Kubernetes Operator
kubectl apply \
    --filename https://github.com/rabbitmq/cluster-operator/releases/download/v1.14.0/cluster-operator.yml

# Certificate Manager for Topology Operator
kubectl apply \
    --filename https://github.com/cert-manager/cert-manager/releases/download/v1.8.2/cert-manager.yaml

# RabbitMQ Messaging Topology Operator
kubectl apply \
    --filename https://github.com/rabbitmq/messaging-topology-operator/releases/download/v1.7.1/messaging-topology-operator-with-certmanager.yaml

kubectl apply \
    --kustomize .
```

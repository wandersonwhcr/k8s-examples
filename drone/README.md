# drone

```
k3d cluster create \
    --config ../k3d-example.yaml

cat > .env <<EOF
DRONE_GOGS_SERVER=http://gogs.gogs
DRONE_RPC_SECRET=`openssl rand -hex 16`
EOF

kubectl apply \
    --kustomize .
```

```
kubectl apply \
    --kustomize ../gogs

# Gogs Install Wizard
kubectl port-forward \
    --namespace gogs \
    service/gogs 8080:http
# Available at http://localhost:8080
```

```
# Drone Install Wizard
kubectl port-forward \
    --namespace drone \
    service/drone 8080:http
# Available at http://localhost:8080
```

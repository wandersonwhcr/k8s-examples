# drone

```
k3d cluster create example \
    --servers 1 \
    --agents 1 \
    --port 80:80@loadbalancer \
    --registry-create registry.example.localhost:5000

kubectl apply \
    --kustomize ../gogs

cat > .env <<EOF
DRONE_GOGS_SERVER=http://gogs.gogs.svc
DRONE_RPC_SECRET=`openssl rand -hex 16`
EOF

kubectl apply \
    --kustomize .
```

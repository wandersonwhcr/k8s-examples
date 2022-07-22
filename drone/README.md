# drone

```
k3d cluster create \
    --config ../k3d-example.yaml

cat > .env <<EOF
DRONE_GOGS_SERVER=http://gogs.gogs.svc
DRONE_RPC_SECRET=`openssl rand -hex 16`
EOF

kubectl apply \
    --kustomize .
```

```
kubectl apply \
    --kustomize ../gogs
```

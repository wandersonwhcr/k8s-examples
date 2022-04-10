# reloader

```
k3d cluster create example \
    --servers 1 \
    --agents 1 \
    --no-lb

cat > ./debug/.env <<EOF
APP_STAGE=qa
APP_URL=https://debug.qa.example.com
EOF

kubectl apply \
    --kustomize ./reloader

kubectl apply \
    --kustomize ./debug
```

# reloader

This example shows how to use
[stakater/Reloader](https://github.com/stakater/Reloader) to automatically
rollout deployments when `Secret` is changed. First, it installs Reloader and
defines a debug application that uses a secret to initialize environment
variables. When this environment is modified and applied, Reloader will rollout
deployment.

```
k3d cluster create example \
    --servers 1 \
    --agents 1 \
    --no-lb

kubectl apply \
    --kustomize ./reloader
```


```
cat > ./debug/.env <<EOF
APP_STAGE=qa
APP_URL=https://debug.qa.example.com
EOF

kubectl apply \
    --kustomize ./debug
```

```
cat > ./debug/.env <<EOF
APP_STAGE=prod
APP_URL=https://debug.example.com
EOF

kubectl apply \
    --kustomize ./debug
```

```
$ kubectl get pods --watch
NAME                     READY   STATUS              RESTARTS   AGE
debug-77cd6db599-qv9bf   1/1     Running             0          58s
debug-86d978db54-7drtv   0/1     Pending             0          0s
debug-86d978db54-7drtv   0/1     Pending             0          0s
debug-86d978db54-7drtv   0/1     ContainerCreating   0          0s
debug-86d978db54-7drtv   1/1     Running             0          7s
debug-77cd6db599-qv9bf   1/1     Terminating         0          100s
debug-77cd6db599-qv9bf   0/1     Terminating         0          101s
debug-77cd6db599-qv9bf   0/1     Terminating         0          101s
debug-77cd6db599-qv9bf   0/1     Terminating         0          101s
```
